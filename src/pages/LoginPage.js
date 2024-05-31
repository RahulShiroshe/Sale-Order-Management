// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Button, Input, VStack, FormControl, FormLabel, useToast } from '@chakra-ui/react';

// const LoginPage = ({ setIsAuthenticated }) => {
//   const [username, setUsername] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const toast = useToast();
//   const navigate = useNavigate();

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const dummyUsername = 'user';
//     const dummyPassword = 'password';

//     if (username === dummyUsername && password === dummyPassword) {
//       setIsAuthenticated(true);
//       toast({
//         title: 'Login successful.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//       navigate('/');
//     } else {
//       toast({
//         title: 'Authentication failed',
//         description: 'Invalid username or password.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
//       <VStack as="form" onSubmit={handleSubmit} spacing={4} p={4} boxShadow="md" borderRadius="md">
//         <FormControl id="username" isRequired>
//           <FormLabel>Username</FormLabel>
//           <Input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Enter your username"
//           />
//         </FormControl>
//         <FormControl id="password" isRequired>
//           <FormLabel>Password</FormLabel>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//           />
//         </FormControl>
//         <Button type="submit" colorScheme="teal" width="full">Login</Button>
//       </VStack>
//     </Box>
//   );
// };

// export default LoginPage;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, VStack, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const LoginPage = ({ setIsAuthenticated }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = ({ username, password }) => {
    const dummyUsername = 'user';
    const dummyPassword = 'password';

    if (username === dummyUsername && password === dummyPassword) {
      setIsAuthenticated(true);
      toast({
        title: 'Login successful.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } else {
      toast({
        title: 'Authentication failed',
        description: 'Invalid username or password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={4}
        p={4}
        boxShadow="md"
        borderRadius="md"
      >
        <FormControl id="username" isInvalid={errors.username} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <Box color="red.500">{errors.username.message}</Box>}
        </FormControl>
        <FormControl id="password" isInvalid={errors.password} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <Box color="red.500">{errors.password.message}</Box>}
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginPage;