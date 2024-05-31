import React, { useState } from 'react';
import {Box,Table,Thead,Tbody,Tr,Th,Td,IconButton,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,FormControl,FormLabel,Input,Select,Button,useDisclosure,
} from '@chakra-ui/react';
import { FiMoreHorizontal } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CompletedSaleOrders = ({ saleOrders, customers, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date());

  const handleView = (order) => {
    setCurrentOrder(order);
    setInvoiceDate(new Date(order.invoice_date));
    onOpen();
  };

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color='green'>Id</Th>
            <Th color='green'>Customer Name</Th>
            <Th color='green'>Price</Th>
            <Th color='green'>Last Modified</Th>
            <Th color='green'>View</Th>
          </Tr>
        </Thead>
        <Tbody>
          {saleOrders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{customers.find(c => c.customer_profile.id === order.customer_id)?.customer_profile.name}</Td>
              <Td>${order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</Td>
              <Td>{new Date(order.invoice_date).toLocaleString()}</Td>
              <Td>
                <IconButton
                  icon={<FiMoreHorizontal />}
                  onClick={() => handleView(order)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {currentOrder && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>View Sale Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="customer_id">
                <FormLabel>Customer</FormLabel>
                <Select value={currentOrder.customer_id} isReadOnly>
                  {customers.map(customer => (
                    <option key={customer.customer_profile.id} value={customer.customer_profile.id}>
                      {customer.customer_profile.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="invoice_no" mt={4}>
                <FormLabel>Invoice Number</FormLabel>
                <Input value={currentOrder.invoice_no} isReadOnly />
              </FormControl>
              <FormControl id="invoice_date" mt={4}>
                <FormLabel>Invoice Date</FormLabel>
                <DatePicker
                  selected={invoiceDate}
                  dateFormat="yyyy/MM/dd"
                  readOnly
                  customInput={<Input />}
                />
              </FormControl>
              <FormControl id="paid" mt={4}>
                <FormLabel>Paid</FormLabel>
                <Select value={currentOrder.paid} isReadOnly>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Select>
              </FormControl>
              {currentOrder.items.map((item, index) => (
                <Box key={index} mt={4}>
                  <FormControl id={`items[${index}].sku_id`}>
                    <FormLabel>Product SKU</FormLabel>
                    <Select value={item.sku_id} isReadOnly>
                      {products.map(product => (
                        product.sku.map(sku => (
                          <option key={sku.id} value={sku.id}>
                            {product.name} - {sku.amount} {sku.unit}
                          </option>
                        ))
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl id={`items[${index}].price`} mt={2}>
                    <FormLabel>Price</FormLabel>
                    <Input type="number" value={item.price} isReadOnly />
                  </FormControl>
                  <FormControl id={`items[${index}].quantity`} mt={2}>
                    <FormLabel>Quantity</FormLabel>
                    <Input type="number" value={item.quantity} isReadOnly />
                  </FormControl>
                </Box>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default CompletedSaleOrders;