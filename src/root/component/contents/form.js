import React from "react";
import { Form, Input, Button } from "antd";
import webtorrent from "webtorrent";
import parseTorrent from "parse-torrent";
import webtorrentHealth from "webtorrent-health";

const FormField = () => {
  const count = React.useRef(0);
  const [fieldA, setFieldA] = React.useState("");
  const [torrentinfo, setTorrentinfo] = React.useState({});
  return (
    <div>
      <b>{count.current++}</b>
      <Form>
        <Form.Item
          label="magnet uri"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Input
            placeholder="input magnet uri"
            onChange={e => {
              setFieldA(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 14, offset: 6 }}>
          <Button
            type="primary"
            onClick={() => {
              const torrentid = parseTorrent(fieldA);
              // console.log(torrentid);
              webtorrentHealth(torrentid, (err, data) => {
                if(err){
                  console.log(err);
                }
                console.log('average number of seeders: ' + data.seeds)
                console.log('average number of leechers: ' + data.peers)
                console.log('ratio: ', +(Math.round((data.peers > 0 ? data.seeds / data.peers : data.seeds) +'e+2') + 'e-2'))
              });
              const client = new webtorrent({blocklist: false});
              client.add(torrentid, torrent => {
                console.log("Client is downloading:", torrent.infoHash);
                console.log(torrent.torrentFileBlobURL);
                const interval = setInterval(() => {
                  setTorrentinfo({
                    torrentProgress: (torrent.progress * 100).toFixed(1) + "%",
                    torrentInfoHash: torrent.infoHash,
                    torrentMagnetURI: torrent.magnetURI,
                    torrentName: torrent.name,
                    torrentDownloaded : torrent.downloaded,
                  });
                }, 5000);

                torrent.on("done", () => {
                  clearInterval(interval);
                });
              });
            }}
          >
            Go
          </Button>
        </Form.Item>
      </Form>
      <p>Torrent Name : {torrentinfo? torrentinfo.torrentName : ""}</p>
      <p>Torrent Progress : {torrentinfo ? torrentinfo.torrentProgress : ""}</p>
      <p>Infohash : {torrentinfo ? torrentinfo.torrentInfoHash : ""}</p>
      <p>Torrent Downloaded : {torrentinfo ? torrentinfo.torrentDownloaded : "" }</p>
    </div>
  );
};

export default FormField;
