import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { UserDto } from "../../types/UserDto";
import React from "react";


export const ProfileModal = ({ user, children }: {user: UserDto | undefined, children: React.ReactNode}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{base: "flex"}} icon={<ViewIcon />} onClick={onOpen} aria-label={""} />
      )}
      
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar
              borderRadius="full"
              boxSize="160px"
              src={user?.pfp}
              name={user?.name}
            />
            <Text
              fontSize={"25px"}
              fontFamily="Work sans"
            >
              E-Mail: {user?.email}
            </Text>
            <Text
              fontSize={"25px"}
              fontFamily="Work sans"
            >
              {user && user?.ratings.length > 0 ? "Ratings: " + (user?.ratings.reduce((a, b) => a + b, 0) / user?.ratings.length) || 0 : "No Ratings Yet" }
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
