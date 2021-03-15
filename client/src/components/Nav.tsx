import React from "react";
import { Link, Box, Flex, Heading } from "@chakra-ui/core";
import { Link as NavLink } from "react-router-dom";
import { getUserSession } from "../auth/UserPool";

interface Props {}

const Nav = (props: Props) => {
  const currentUser = getUserSession();

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="teal.600"
      color="white"
      p={4}
    >
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NavLink to="/">
          <Heading>Paragone</Heading>
        </NavLink>
        <Box ml={"auto"}>
          {currentUser ? (
            <NavLink to="/login">
              <Link mr={2}>Logout</Link>
            </NavLink>
          ) : (
            <>
              <NavLink to="/login">
                <Link mr={2}>Login</Link>
              </NavLink>
              <NavLink to="/register">
                <Link>Register</Link>
              </NavLink>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Nav;
