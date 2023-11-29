import {
  Container,
  Box,
  Text,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import React from "react"
import { Login } from "../components/authentication/Login"
import { SignUp } from "../components/authentication/SignUp"
import { useNavigate } from "react-router-dom"

function HomepageView() {
  const navigate = useNavigate()
  React.useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo")

    if (userInfoString) {
      navigate("/conversations")
    }
  }, [navigate])
  //Container helps with responsive design
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          fontWeight="bold"
          color="blueviolet"
        >
          CHAT24
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        color="black"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomepageView
