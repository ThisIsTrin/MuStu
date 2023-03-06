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

const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;

export default function Index() {
  const [searchResults, setSearchResults] = useState(null);

  async function onSearch(values, actions) {
    let query = values.searchQuery;

    if (query.length) {
      let options = {
        method: "GET",
        url: "https://shazam.p.rapidapi.com/search",
        params: { term: query, locale: "en-US", offset: "0", limit: "5" },
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "shazam.p.rapidapi.com",
        },
      };

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

  return (
    <Box maxW="800px" mx="auto" px="4">
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

      {searchResults ? (
        <Stack spacing="4">
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