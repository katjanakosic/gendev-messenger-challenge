import { Button } from "@chakra-ui/button"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input"
import { VStack } from "@chakra-ui/layout"
import { useState } from "react"
import axios from "axios"
import { useToast } from "@chakra-ui/react"

export const Login = () => {
  const [show, setShow] = useState<any>(false)
  const handleClick = () => setShow(!show)
  const toast = useToast()
  const [email, setEmail] = useState<any>()
  const [password, setPassword] = useState<any>()
  const [loading, setLoading] = useState<any>(false)

  const submitHandler = async () => {}

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
