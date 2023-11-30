import React, { useState } from "react"
import { FaStar } from "react-icons/fa"
import { Radio, HStack, Box } from "@chakra-ui/react"

export const StarRating = ({
  rating,
  setRating,
  count,
  size,
}: {
  rating: number
  setRating: React.Dispatch<React.SetStateAction<number>>
  count: number
  size: number
}) => {
  // count: number of stars you want, pass as props
  //size: size of star that you want
  const [hover, setHover] = useState<number | null>(null)

  return (
    <HStack spacing={"2px"}>
      {[...Array(count || 5)].map((star, index) => {
        const ratingValue = index + 1
        return (
          <Box
            as="label"
            key={index}
            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <Radio
              name="rating"
              onChange={() => setRating(ratingValue)}
              value={ratingValue.toString()}
              display="none"
            ></Radio>
            <FaStar
              cursor={"pointer"}
              size={size || 20}
              transition="color 200ms"
            />
          </Box>
        )
      })}
    </HStack>
  )
}
