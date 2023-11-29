import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Select,
  Text,
} from "@chakra-ui/react"
import React, { useState } from "react"
import axios from "axios"
import { useToast } from "@chakra-ui/toast"
import { useNavigate } from "react-router-dom"

//TODO: Implement user type selection with a picker for 'customer' or 'service provider' which are both required fields

export const SignUp = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [address, setAddress] = useState("")
  const [phone_number, setPhoneNumber] = useState("")
  const [pfp, setPfp] = useState("")
  const [picLoading, setPicLoading] = useState(false)
  const [userType, setUserType] = useState("customer")
  const [url, setUrl] = useState("")

  const handleClick = () => setShow(!show)

  const postDetails = (pics: FileList | null) => {
    setPicLoading(true)

    if (!pics || pics.length === 0) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setPicLoading(false)
      return
    }

    const selectedFile = pics[0]

    console.log(selectedFile)

    if (
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/png"
    ) {
      const data = new FormData()
      data.append("file", selectedFile)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "dpq6lqjdw")

      fetch("https://api.cloudinary.com/v1_1/dpq6lqjdw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPfp(data.url.toString())
          console.log(data.url.toString())
          setPicLoading(false)
        })
        .catch((err) => {
          console.log(err)
          setPicLoading(false)
        })
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setPicLoading(false)
      return
    }
  }

  const submitHandler = async () => {
    setPicLoading(true)
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !address ||
      !phone_number ||
      !userType
    ) {
      toast({
        title: "Please fill out all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setPicLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setPicLoading(false)
      return
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const { data } = await axios.post(
        "/api/user/signup",
        {
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          address: address,
          phone_number: phone_number,
          pfp: pfp,
          user_type: userType,
          url: url,
        },
        config
      )

      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      console.log("#########", data)
      setPicLoading(false)
      //navigate("/chats")
    } catch (error: any) {
      toast({
        title: error,
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setPicLoading(false)
    }
  }

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
            type={show ? "text" : "password"}
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
            type={show ? "text" : "password"}
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
          onChange={(e) => postDetails(e.target.files)}
        />
      </FormControl>
      <FormLabel alignSelf="start">I am a...</FormLabel>
      <Select
        defaultValue={userType}
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
      >
        <option value="customer">Customer</option>
        <option value="service_provider">Service Provider</option>
      </Select>
      {userType === "service_provider" && (
        <FormControl id="url">
          <FormLabel>URL</FormLabel>
          <Input
            placeholder="Please enter Your URL"
            onChange={(e) => setUrl(e.target.value)}
          />
        </FormControl>
      )}
      <Button
        colorScheme="purple"
        isLoading={picLoading}
        width="100%"
        style={{ marginTop: "15" }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  )
}
