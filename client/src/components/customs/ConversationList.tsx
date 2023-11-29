import React from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { ConversationState } from '../../context/ConversationContextProvider'

export const ConversationList = () => {

  const [loggedUser, setLoggedUser] = React.useState("")
  const { selectedConversation, setSelectedConversation, user, conversations, setConversations } = ConversationState()
  const toast = useToast()

  const fetchConversations = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get("/api/conversation", config);
      setConversations(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the conversations",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  React.useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo") || "{}"));
    fetchConversations();
  }, []);

  return (
    <div>
     
    </div>
  )
}
