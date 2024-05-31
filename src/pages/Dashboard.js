import React, { useState } from 'react';
import {ChakraProvider,Box,Button,useDisclosure,Tabs,TabList,TabPanels,Tab,TabPanel,
} from '@chakra-ui/react';
import CreateSaleOrderModal from './CreateSaleOrderModal';
import ActiveSaleOrders from './ActiveSaleOrders';
import CompletedSaleOrders from './CompletedSaleOrders';
import ThemeToggle from '../components/ThemeToggle';

const customers = [
  {
    id: 9,
    customer: 11908,
    customer_profile: {
      id: 11908,
      name: "Ram",
      color: [182, 73, 99],
      email: "jesus_christ@church.com",
      pincode: "Mumbai",
      location_name: "Mumabi, Maharashtra, India",
      type: "C",
      profile_pic: null,
      gst: ""
    }
  },
];

const products = [
  {
    id: 209,
    display_id: 8,
    owner: 1079,
    name: "New Product",
    category: "The god of War",
    characteristics: "New Product Characteristics",
    features: "",
    brand: "New Product Brand",
    sku: [
      {
        id: 248,
        selling_price: 54,
        max_retail_price: 44,
        amount: 33,
        unit: "kg",
        quantity_in_inventory: 0,
        product: 209
      },
      {
        id: 247,
        selling_price: 32,
        max_retail_price: 32,
        amount: 33,
        unit: "kg",
        quantity_in_inventory: 0,
        product: 209
      },
      {
        id: 246,
        selling_price: 23,
        max_retail_price: 21,
        amount: 22,
        unit: "kg",
        quantity_in_inventory: 1,
        product: 209
      }
    ],
    updated_on: "2024-05-24T12:46:41.995873Z",
    adding_date: "2024-05-24T12:46:41.995828Z"
  },
];

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [saleOrders, setSaleOrders] = useState([
    {
      id: 1,
      customer_id: 11908,
      items: [
        {
          sku_id: 248,
          price: 54,
          quantity: 10
        }
      ],
      paid: false,
      invoice_no: "invoice-123",
      invoice_date: "2024-05-30T12:34:56Z",
      status: 'active',
    },
    {
      id: 2,
      customer_id: 11908,
      items: [
        {
          sku_id: 246,
          price: 23,
          quantity: 5
        }
      ],
      paid: true,
      invoice_no: "invoice-124",
      invoice_date: "2024-05-24T08:22:33Z",
      status: 'completed',
    },
  ]);

  const addSaleOrder = (newOrder) => {
    setSaleOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const updateSaleOrder = (updatedOrder) => {
    setSaleOrders((prevOrders) => 
      prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  const activeSaleOrders = saleOrders.filter((order) => order.status === 'active');
  const completedSaleOrders = saleOrders.filter((order) => order.status === 'completed');

  return (
    <ChakraProvider>
      <Box p={4}>
        <ThemeToggle />
        <CreateSaleOrderModal 
          isOpen={isOpen} 
          onClose={onClose} 
          addSaleOrder={addSaleOrder} 
          customers={customers} 
          products={products} 
        />
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <Tab ml={20} borderRadius={10}>Active Sale Orders</Tab>
            <Tab ml={15} borderRadius={10} mr={80}>Completed Sale Orders</Tab>
            <Button onClick={onOpen} colorScheme="teal" marginLeft={80}>+ Sale Order</Button>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ActiveSaleOrders 
                saleOrders={activeSaleOrders} 
                updateSaleOrder={updateSaleOrder} 
                customers={customers} 
                products={products} 
              />
            </TabPanel>
            <TabPanel>
              <CompletedSaleOrders 
                saleOrders={completedSaleOrders} 
                customers={customers} 
                products={products} 
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;