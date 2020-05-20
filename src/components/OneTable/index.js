import React, { Component } from "react";

import Wrapper from '../../components/Wrapper';
import T from './../Table/Table';
import TTitle from './../Table/TTitle';
import Th from './../Table/Th';
import Td from './../Table/Td';
import Tr from './../Table/Tr';
import THead from './../Table/THead';
import TBody from './../Table/TBody';
import TFooter from './../Table/TFooter';
import moreThan from '../../utils/images/right-arrow.png';

class OneTable extends Component {
  render () {
    return (
      <Wrapper className="t-wrapper">
        <T>
          <TTitle>LATEST BLOCKS</TTitle>
          <THead className="latest-blks">
            <Tr>
              <Th>BLOCK #</Th>
              <Th>HASH</Th>
              <Th>TIMESTAMP</Th>
              <Th>NETWORK</Th>
              <Th>LOREM</Th>
              <Th> </Th>
            </Tr>
          </THead>
          <TBody className="l-blocks">
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
            <Tr>
              <Td> <a href="http://example.com">36792</a> </Td>
              <Td> <a href="http://example.com">a969144c864bd87abd87a9974f187a9974f1</a> </Td>
              <Td>34 sec ago</Td>
              <Td> <a href="http://example.com"> POCKET TESTNET </a> </Td>
              <Td> <a href="http://example.com"> 94691343T5cbd87abd8864bd87abd87a9974f1R34 </a> </Td>
              <Td> <a href="http://example.com"> <img src={moreThan} alt="greater than" /> </a> </Td>
            </Tr>
          </TBody>
          <TFooter>
            <Tr>
              <Td colSpan={6}> 
                <a href="http://example.com" target="_blank" rel="noopener noreferrer" className="button button-1"> Load More </a> 
              </Td>
            </Tr>
          </TFooter>
        </T>
      </Wrapper>
    );
  }
}

export default OneTable;