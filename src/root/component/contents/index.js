import React from "react";
import { Row, Col } from "antd";
import FormField from "./form";

export const Contents = () => {
  return (
    <div>
      <Row>
        <Col span={12}>
          <FormField />
        </Col>
      </Row>
    </div>
  );
};

export default Contents;
