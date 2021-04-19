import React, { useContext } from "react";
import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as NavLink } from "react-router-dom";
import { UserContext } from "../Auth";

const Nav = () => {
  const { authenticated, logout } = useContext(UserContext);

  return (
    <Flex bg="teal.600" color="white" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NavLink to="/">
          <Heading>Paragone</Heading>
        </NavLink>
        <Box ml={"auto"}>
          {authenticated ? (
            <Link mr={2} onClick={logout}>
              Logout
            </Link>
          ) : (
            <>
              <Link as={NavLink} to="/login" mr={2}>
                Login
              </Link>
              <Link as={NavLink} to="/register">
                Register
              </Link>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Nav;
