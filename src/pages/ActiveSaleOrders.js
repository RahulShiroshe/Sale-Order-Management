import React, { useState } from 'react';
import {Box,Table,Thead,Tbody,Tr,Th,Td,IconButton,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,FormControl,FormLabel,Input,Select,Button,useDisclosure,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiMoreHorizontal } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ActiveSaleOrders = ({ saleOrders, updateSaleOrder, customers, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  const [currentOrder, setCurrentOrder] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const count = 1;

  const handleEdit = (order) => {
    setCurrentOrder(order);
    setValue('customer_id', order.customer_id);
    setValue('invoice_no', order.invoice_no);
    setInvoiceDate(new Date(order.invoice_date));
    setValue('paid', order.paid);
    setInvoiceDate(new Date(order.invoice_date));
    order.items.forEach((item, index) => {
      append(item);
    });
    onOpen();
  };

  const onSubmit = (data) => {
    const updatedOrder = {
      ...currentOrder,
      customer_id: parseInt(data.customer_id),
      items: data.items.map(item => ({
        sku_id: parseInt(item.sku_id),
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
      })),
      paid: data.paid,
      invoice_no: data.invoice_no,
      invoice_date: invoiceDate.toISOString(),
    };
    updateSaleOrder(updatedOrder);
    onClose();
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
          <Th color='green'>Edit/View</Th>
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
                  onClick={() => handleEdit(order)}
                  aria-label="Edit sale order"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Sale Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl id="customer_id" isRequired isInvalid={errors.customer_id}>
                <FormLabel>Customer</FormLabel>
                <Select {...register('customer_id', { required: 'Customer is required' })}>
                  {customers.map(customer => (
                    <option key={customer.customer_profile.id} value={customer.customer_profile.id}>
                      {customer.customer_profile.name}
                    </option>
                  ))}
                </Select>
                {errors.customer_id && <p>{errors.customer_id.message}</p>}
              </FormControl>
              <FormControl id="invoice_no" isRequired isInvalid={errors.invoice_no} mt={4}>
                <FormLabel>Invoice Number</FormLabel>
                <Input 
                  {...register('invoice_no', { required: 'Invoice number is required' })} 
                  placeholder="Invoice Number" 
                />
                {errors.invoice_no && <p>{errors.invoice_no.message}</p>}
              </FormControl>
              <FormControl id="invoice_date" isRequired isInvalid={errors.invoice_date} mt={4}>
                <FormLabel>Modified Date</FormLabel>
                <DatePicker
                  selected={invoiceDate}
                  onChange={(date) => setInvoiceDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="chakra-input css-1c6ws50"
                />
              </FormControl>
              <FormControl id="paid" mt={4}>
                <FormLabel>Paid</FormLabel>
                <Select {...register('paid')}>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Select>
              </FormControl>
              {fields.map((item, index) => (
                <Box key={item.id} mt={4}>
                  <FormControl id={`items[${index}].sku_id`} isRequired isInvalid={errors.items?.[index]?.sku_id}>
                    <FormLabel>Product SKU</FormLabel>
                    <Select {...register(`items[${index}].sku_id`, { required: 'SKU is required' })}>
                      {products.map(product => (
                        product.sku.map(sku => (
                          <option key={sku.id} value={sku.id}>
                            {product.name} - {sku.amount} {sku.unit}
                          </option>
                        ))
                      ))}
                    </Select>
                    {errors.items?.[index]?.sku_id && <p>{errors.items[index].sku_id.message}</p>}
                  </FormControl>
                  <FormControl id={`items[${index}].price`} isRequired isInvalid={errors.items?.[index]?.price} mt={2}>
                    <FormLabel>Price</FormLabel>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...register(`items[${index}].price`, { required: 'Price is required' })} 
                    />
                    {errors.items?.[index]?.price && <p>{errors.items[index].price.message}</p>}
                  </FormControl>
                  <FormControl id={`items[${index}].quantity`} isRequired isInvalid={errors.items?.[index]?.quantity} mt={2}>
                    <FormLabel>Quantity</FormLabel>
                    <Input 
                      type="number" 
                      {...register(`items[${index}].quantity`, { required: 'Quantity is required' })} 
                    />
                    {errors.items?.[index]?.quantity && <p>{errors.items[index].quantity.message}</p>}
                  </FormControl>
                  <Button mt={2} onClick={() => remove(index)} colorScheme="red">Remove Item</Button>
                </Box>
              ))}
              <Button mt={4} onClick={() => append({})} colorScheme="teal">Add Item</Button>
              <Button type="submit" colorScheme="teal" mt={4}>Save</Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ActiveSaleOrders;