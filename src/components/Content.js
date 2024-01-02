import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import contentData from "../utils/contentData";
import { Link } from "react-router-dom/cjs/react-router-dom";

class Content extends Component {
  render() {
    return (
      <div className="next-steps my-5">
        <h2 className="my-5 text-center">What can I do next?</h2>
        <Row className="d-flex justify-content-between">
          {contentData.map((col, i) => (
            <Col key={i} md={5} className="mb-4">
              <h6 className="mb-3">
                <Link to={`${col.link}`}>
                  <FontAwesomeIcon icon="link" className="mr-2" />
                  { col.title }
                </Link>
            </h6><p>{col.description}</p>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default Content;
