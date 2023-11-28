import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
  } from "@chakra-ui/react"
  import React, { useState } from "react"
  
  export const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState<any>()
    const [email, setEmail] = useState<any>()
    const [password, setPassword] = useState<any>()
    const [confirmPassword, setConfirmPassword] = useState<any>()
    const [address, setAddress] = useState<any>()
    const [phone_number, setPhoneNumber] = useState<any>()
    const [pfp, setPfp] = useState<any>()
  
    const handleClick = () => setShow(!show)
    const postDetails = () => {}
    const submitHandler = () => {}
  
    return (
      <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Please enter Your name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Please enter Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show? "text" : "password"}
              placeholder="Please enter Your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={show? "text" : "password"}
              placeholder="Please confirm Your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
          <FormControl id="address" isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                  placeholder="Please enter Your address"
                  onChange={(e) => setAddress(e.target.value)}
              />
          </FormControl>
          <FormControl id="phone_number" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                  placeholder="Please enter Your phone number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
              />
          </FormControl>
          <FormControl id="pfp">
              <FormLabel>Profile Picture</FormLabel>
              <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  placeholder="Please upload a profile picture"
                  onChange={(e) => postDetails(/* e.target.files[0] */)}
              />
          </FormControl>
          <Button
              colorScheme="purple"
              width="100%"
              style={{ marginTop: "15" }}
              onClick={submitHandler}
          >
              Sign Up
          </Button>
      </VStack>
    )
  }
  