import { Avatar } from "@chakra-ui/avatar"
import { Box, Text } from "@chakra-ui/layout"
import { UserDto } from "../../types/UserDto"
import { StarIcon } from "@chakra-ui/icons"

const UserListItem = ({
  user,
  handleFunction,
}: {
  user: UserDto
  handleFunction: () => void
}) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user?.name}
        src={user?.pfp}
      />
      <Box display="flex">
        <Box mr={10}>
          <Text>{user?.name}</Text>
          <Text fontSize="xs">
            <b>Email: </b>
            {user?.email}
          </Text>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <StarIcon color="yellow.400" />
          <Text fontSize="xs">
            {user && user?.ratings.length > 0
              ? "Rating: " +
                  user?.ratings.reduce((a, b) => a + b, 0) /
                    user?.ratings.length || 0
              : "No Rating"}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default UserListItem
