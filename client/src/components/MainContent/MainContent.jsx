import React from "react";
import ProjectCard from "./ProjectCard";
import { Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import SearchFilter from "./SearchFilter";
import { searchStore } from "../../store";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const MainContent = () => {
  const search = searchStore((state) => state.search);
  const [discplines, setDiscplines] = React.useState([]);
  console.log(process.env.NODE_ENV);
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost/"
      : "https://cduprojects.spinetail.cdu.edu.au/adminpage/";
  const fetchProjects = async () => {
    // if in development mode, api url is localhost, else it is the cpanel url

    const { projects } = await axios.get(url+"all_projects.php");
    return projects.projects.slice(0,10);
    //error handling
  };
  const fetchMapping = async () => {
    // if in development mode, api url is localhost, else it is the cpanel url

    const { mappings } = await axios.get(url+"project_discipline.php");
    // console.log("fetchMapping", data);
    return mappings['projects discipline mapping'];
    //error handling
  };



  React.useEffect (() => {
    fetchMapping().then((data) => {
      setDiscplines(data);
    })
    ;
  }, []);


  // on dataM fetched, save the result to discplinestore

  const { isLoading, isError, isSuccess, data, error, } = useQuery(
    ["projects"],
    fetchProjects
  );

  const findDiscpline = (projectId, discplines) => {
    const result = [];
    if (discplines) {
      discplines.forEach((discpline) => {
        if (discpline.project_id === projectId) {
          result.push(discpline.discipline_code);
        }
      });
    }
    return result;
  };







  return isLoading ? (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  ) : isSuccess ? (
    <Flex flexDir="column" w="100%" h="100%" color="DarkShades" bg="ContentBG">
      <SearchFilter />
      <Grid
        templateColumns="repeat(auto-fill, minmax(360px, 1fr))"
        gap={8}
        p="32px 32px 120px 32px"
        justifyContent="space-between"
        overflow={"auto"}
      >
        {discplines &&
          data
            .filter((project) =>
              Object.values(project)
                .join("")
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((project) => (
              <ProjectCard key={project.project_id} project={project}  discplines={findDiscpline(project.project_id, discplines)}/> // why getDiscplines(project.project_id) is not working? maybe because it is async? how do you know? 
            ))}
      </Grid>
    </Flex>
  ) : (
    isError && (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <Text>Something went wrong</Text>
      </Flex>
    )
  );
};

export default MainContent;
