import React, {useState, useRef} from "react";
import { 
  Box, 
  Flex, 
  Text, 
  Button,
  Alert,
  AlertTitle,
  AlertDescription,
  ScaleFade,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Stack,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react' 
import { CheckCircleIcon } from "@chakra-ui/icons";
import axios from "axios";

// drag and drop stuff
import Container from "./Container";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStore,cardStore } from "../../store";

const SideMenu = () => {
  const submitModal = useDisclosure()
  const initialRef = useRef(null)
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false })
  const [isSubmitted, setIsSubmitted] = useState(false);

  const postUrl = process.env.NODE_ENV === "development" ? "http://localhost/add_project_register.php" : "https://cduprojects.spinetail.cdu.edu.au/adminpage/add_project_register.php";

  const Rank = useStore((state) => state.Rank);
  const gloCard = cardStore((state) => state.card);

  const handleSubmit = () => {
    // post the data to the database
    console.log("submit");


    gloCard.map(
      (card) => {
        axios.post(postUrl, JSON.stringify({
          student_id: JSON.parse(sessionStorage.getItem("user")).studentid,
          project_id: card.id,
          project_ranking: gloCard.indexOf(card) + 1,
          state: "initial",
          state_changed_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
          approve: 0,
        }))
        .then((res) => {
          console.log("res", res.data);
        })
        .catch((err) => {
          console.log("err", err);
        });
      }
    )
      onOpen()
      setIsSubmitted(true);
      
  };

 

  return (
    <Flex
      w="400px"
      height="95vh"
      pb={7}
      bg="BG"
      color="DarkShades"
      flexDirection="column"
      borderRight="1px solid #E2E8F0"
      justifyContent="space-between"
    >
      <Flex flexDir="column">
        <Box p="1rem" bg="DarkShades" textAlign="center" width="100%">
          <Text fontSize="1rem" fontWeight="bold" color="LightShades">
            <Stack direction="row" spacing={2} align="center">
              <Text>Please select up to 3 projects</Text>

              <CircularProgress value={Rank.length*33.333}>
                <CircularProgressLabel>{Rank.length}/3</CircularProgressLabel>
              </CircularProgress>
            </Stack>
          
          </Text>
        </Box>
        <Box p="1rem">
          

          <DndProvider backend={HTML5Backend}>
            <Container />
          </DndProvider>
        </Box>
      </Flex>

        <Button 
          className="submit-btn"
          mx="1rem"
          bg="AccentMain.default"
          colorScheme="purple"
          onClick={submitModal.onOpen}
          disabled={Rank.length < 3 || isSubmitted === true }
          
        >
          Submit
        </Button>

        <Modal 
          initialFocusRef={initialRef}
          isOpen={submitModal.isOpen} 
          onClose={submitModal.onClose} 
          closeOnOverlayClick={false} 
          size="xl">
        <ModalOverlay
        
           />
        <ModalContent>
          <ModalHeader fontSize={24} >Submit your project selection</ModalHeader>
          <ModalCloseButton ref={initialRef}/>
          <ModalBody>
            {isVisible ? 
            
           (
            <ScaleFade initialScale={0.9} in={isVisible}> 
              <Alert
                status='success'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='280px'
              >
              <CheckCircleIcon boxSize='40px' mr={0} color="green.500"/>
              <AlertTitle mt={4} mb={1} fontSize='lg'>
                Application submitted!
              </AlertTitle>
              <AlertDescription maxWidth='md' whiteSpace="normal">
                Thanks for submitting your application. Your application will be responded within 3 working days. 
                Please check your email for further information.
              </AlertDescription>
            </Alert>
          </ScaleFade>
          ):
          (
            <>
            <Flex flexDir="column" gap={2} mt={6}>
            { gloCard.map((item) => (

              <Box key={item.id}  borderRadius={5} py={4} px={2} bg="gray.100" color="DarkShades">
                <Flex flexDir="row" alignItems="flex-start" gap={3}>
                  <Flex bg="DarkShades" minW="2rem"minH="2rem" borderRadius="100" justifyContent="center" alignItems="center" textAlign="center">
                    <Text color="LightShades" fontWeight="bold">
                      {gloCard.indexOf(item) + 1}
                    </Text>
                  </Flex>
                  <Flex flexDir="column" gap={4}>

                    <Text fontWeight="bold" lineHeight="20px">{item.topic}</Text>

                    <Flex flexDir="row" gap={1} flexWrap="wrap" alignItems="center" >
                      <Stack direction="row" alignItems="center" mr={4}>
                        <Text fontWeight="bold"  lineHeight="20px" >{item.lecturer.name}</Text>

                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <Text lineHeight="20px">{item.lecturer2.name}</Text>
                      </Stack>
                    </Flex>
                  </Flex>
                
                </Flex>
              </Box>
              )
            )}
            </Flex>
            <Flex gap={1} flexDir="column" mt={10}>
              {window &&  <Text>Submit as: <b >{JSON.parse(sessionStorage.getItem("user")).name}</b></Text>}
              {window &&  <Text>Email: <b>{JSON.parse(sessionStorage.getItem("user")).email}</b></Text>}
            </Flex>

            <Flex flexDir="column" gap={2} mt={8}>
              <Text>
              Your supervisor will be informed of your application. 
              </Text>
              <Text>
              Once your application is approved, you will receive an email notification. Please pay attemtion to your mailbox. 

              </Text>
              
            </Flex>
            </>
          )}
            

          </ModalBody>

          <ModalFooter mt={8}>
            {
              !isSubmitted&&
              <>
                <Button mr={3} onClick={handleSubmit} colorScheme="purple">
                  Confirm and Submit
                </Button>
                <Button variant='ghost' onClick={submitModal.onClose} >
                  Cancel
                </Button>
              </>
             }
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Flex>
  );
};

export default SideMenu;
