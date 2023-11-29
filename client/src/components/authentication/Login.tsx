import { Button } from "@chakra-ui/button"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { VStack } from "@chakra-ui/layout"
import { useState } from "react"
import axios from "axios"
import { useToast } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export const Login = () => {
  const handleClick = () => setShow(!show)
  const toast = useToast()
  const navigate = useNavigate()

  const [show, setShow] = useState<any>(false)
  const [email, setEmail] = useState<any>()
  const [password, setPassword] = useState<any>()
  const [loading, setLoading] = useState<any>(false)

  const submitHandler = async () => {
    setLoading(true)
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
      return
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const data = await axios.post(
        "/api/user/login",
        { email, password },
        config
      )

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/conversations")
    } catch (error: any) {
      toast({
        title: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Please enter Your e-mail address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Please enter Your password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="purple"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="blue"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com")
          setPassword("123456")
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}
