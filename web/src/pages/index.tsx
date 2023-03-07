import { SearchIcon } from "@chakra-ui/icons";
import {
  Card,
  Heading,
  Stack,
  Text,
  Image,
  IconButton,
  InputGroup,
  Box,
  Input,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useState } from "react";

// rapidApiKey
const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export default function Index() {
  const [searchResults, setSearchResults] = useState(null);

  // Function to handle search query
  async function onSearch(values, actions) {
    let query = values.searchQuery;

    // Check if search query is not empty
    if (query.length) {
      // Set options for the request to the Shazam API
      let options = {
        method: "GET",
        url: "https://shazam.p.rapidapi.com/search",
        params: { term: query, locale: "en-US", offset: "0", limit: "5" },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "shazam.p.rapidapi.com",
        },
      };

      // Send a request to the Shazam API and set the search results state
      await axios
        .request(options)
        .then(function (response) {
          const { tracks, artists } = response.data;
          setSearchResults({ tracks, artists });
        })
        .catch(function (error) {
          console.error(error);
        });

      actions.resetForm();
    }
  }

  // Render 
  return (
    <Box maxW="800px" mx="auto" px="4">
      {/* Use Formik to handle the search form */}
      <Formik
        initialValues={{
          searchQuery: "",
        }}
        onSubmit={onSearch}
      >
        {(props) => (
          <Form>
            <InputGroup size="md" my="5">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
                h="100%"
              />
              <Input
                type="text"
                name="searchQuery"
                placeholder="Search"
                aria-label="Search"
                size="lg"
                focusBorderColor="indigo.500"
                {...props.getFieldProps("searchQuery")}
              />
              <IconButton
                type="submit"
                isLoading={props.isSubmitting}
                aria-label="Search"
                size="lg"
                icon={<SearchIcon />}
              />
            </InputGroup>
          </Form>
        )}
      </Formik>

      {/* If there are search results, render them */}
      {searchResults ? (
        <Stack spacing="4">
          {/* If there are song results, render them */}
          {searchResults.tracks.hits.length > 0 && (
            <Box>
              <Heading size="md" my="5">
                Songs
              </Heading>
              <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="4">
                {searchResults.tracks.hits.map((track) => (
                  <Card
                    key={track.track.key}
                    maxW="sm"
                    boxShadow="md"
                    borderRadius="lg"
                  >
                    <Skeleton isLoaded={track.track.images.coverart}>
                      <Image
                        src={track.track.images.coverart}
                        borderRadius="lg"
                      />
                    </Skeleton>
                    <Box p="4">
                      <Heading size="sm">{track.track.title}</Heading>
                      <Text fontSize="sm" mt="2">
                        {track.track.subtitle}
                      </Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}
          {/* If there are artist results, render them */}
          {searchResults.artists.hits.length > 0 && (
            <Box>
              <Heading size="md" my="5">
                Artists
              </Heading>
              <SimpleGrid columns={{ sm: 2, md: 3 }} spacing="4">
                {searchResults.artists.hits.map((artist) => (
                  <Card key={artist.artist.adamid} maxW="sm" boxShadow="md">
                    <Skeleton isLoaded={artist.artist.avatar}>
                      <Image src={artist.artist.avatar} borderRadius="lg" />
                    </Skeleton>
                    <Box p="4">
                      <Heading size="sm">{artist.artist.name}</Heading>
                      <Text fontSize="sm" mt="2">
                        Artist
                      </Text>
                    </Box>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Stack>
      ) : (
        <Box textAlign="center" mt="10">
          <Heading size="lg">Search for songs and artists</Heading>
        </Box>
      )}
    </Box>
  );
}
