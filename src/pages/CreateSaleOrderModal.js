import React, { useState, useEffect } from 'react';
import {Box,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Button,FormControl,FormLabel,Input,Select,useToast,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';

const CreateSaleOrderModal = ({ isOpen, onClose, addSaleOrder, customers, products }) => {
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  const toast = useToast();

  const onSubmit = (data) => {
    const newOrder = {
      customer_id: parseInt(data.customer_id),
      items: data.items.map(item => ({
        sku_id: parseInt(item.sku_id),
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity)
      })),
      paid: data.paid,
      invoice_no: data.invoice_no,
      invoice_date: new Date(data.invoice_date).toISOString(),
      status: 'active',
    };
    addSaleOrder(newOrder);
    toast({
      title: 'Sale order created.',
      description: `Order for customer ${data.customer_id} has been created.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Sale Order</ModalHeader>
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
              <FormLabel>Invoice Date</FormLabel>
              <Input 
                type="date" 
                {...register('invoice_date', { required: 'Invoice date is required' })} 
              />
              {errors.invoice_date && <p>{errors.invoice_date.message}</p>}
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
            <Button type="submit" colorScheme="teal" mt={4}>Create</Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateSaleOrderModal;