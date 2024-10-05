'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Box, Button, Container, Flex, Heading, Image, Text, VStack, Tabs, TabList, Tab, TabPanels, TabPanel, Card, CardBody, CardFooter, Stack, Input, useColorMode, IconButton, Badge } from "@chakra-ui/react"
import { Github, Linkedin, Twitter, Send, Sun, Moon } from 'lucide-react'

export function PortfolioComponent() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I am Jane's AI assistant. How can I help you with design questions?" }
  ])
  const [userInput, setUserInput] = useState('')

  const featuredProjects = [
    { title: "Facebook Project", description: "UX/UI design for a social media platform", image: "/facebook.png" },
    { title: "Square Project", description: "Product design for a payment system", image: "/square.png" },
    { title: "Slide Project", description: "Redesign of a presentation software", image: "/slide.png" },
  ]

  const sideProjects = [
    { title: "Prepitch", description: "Personal project for pitch preparation", image: "/prepitch.png" },
    { title: "New Careers", description: "Mobile app design for career transitions", image: "/newcareers.png" },
    { title: "Audio Nexus", description: "Web app design for audio enthusiasts", image: "/audionexus.png" },
  ]

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim() === '') return

    const newMessages = [
      ...chatMessages,
      { role: 'user', content: userInput },
      { role: 'assistant', content: `As Jane, I would say: "${generateJaneResponse()}"` }
    ]
    setChatMessages(newMessages)
    setUserInput('')
  }

  const generateJaneResponse = () => {
    const responses = [
      "That is an interesting design challenge. I will approach it by first conducting user research to understand the core needs.",
      "In my experience, the key to solving that kind of problem is to focus on user-centered design principles.",
      "I have worked on similar projects before. The most important thing is to iterate quickly and gather user feedback.",
      "That is a great question! I will start by creating low-fidelity wireframes to explore different solutions.",
      "When dealing with complex UX problems, I find it helpful to break them down into smaller, manageable components.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <Box minHeight="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      {/* Navigation */}
      <Box as="nav" borderBottom="1px" borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} position="sticky" top="0" zIndex="10" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="lg" fontWeight="bold">Martin Tejeda</Heading>
            <Flex gap={2}>
              <Button
                as={Link}
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                colorScheme={colorMode === 'light' ? 'blue' : 'teal'}
                _hover={{
                  bg: colorMode === 'light' ? 'blue.600' : 'teal.600',
                }}
              >
                Resume
              </Button>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                onClick={toggleColorMode}
                variant="outline"
                colorScheme={colorMode === 'light' ? 'blue' : 'teal'}
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container as="main" maxW="container.xl" py={8}>
        {/* About Me */}
        <VStack as="section" spacing={12} align="stretch" py={12}>
          <Flex direction={["column", "row"]} align="stretch" gap={8}>
            <Box width={["100%", "50%"]}>
              <Box borderRadius="md" overflow="hidden">
                <iframe
                  width="100%"
                  height="300px"
                  src="https://www.youtube.com/embed/Eim7-Pb2eVg"
                  title="Portfolio Creation Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
              <Flex justify="center" mt={2}>
                <Badge colorScheme="purple" fontSize="sm" p={2}>
                  Watch how I made this portfolio with AI!
                </Badge>
              </Flex>
            </Box>
            <Box width={["100%", "50%"]}>
              <Heading as="h2" size="xl" mb={4}>About Me</Heading>
              <Text mb={4}>
                Hi, I am Martin Tejeda, a passionate product designer with over 5 years of experience in creating
                user-centered digital products. I specialize in UX research, UI design, and usability testing.
              </Text>
              <Text>
                My goal is to create intuitive and beautiful interfaces that solve real problems for users.
                I am constantly learning and adapting to new technologies and design trends to deliver the best
                possible solutions.
              </Text>
            </Box>
          </Flex>
        </VStack>

        {/* Projects */}
        <Box as="section" py={12}>
          <Heading as="h2" size="xl" mb={8}>Projects</Heading>
          <Tabs variant='enclosed'>
            <TabList>
              <Tab>Featured Projects</Tab>
              <Tab>Side Projects</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={8}>
                  {featuredProjects.map((project, index) => (
                    <Card
                      key={index}
                      direction={{ base: 'column', sm: 'row' }}
                      overflow='hidden'
                      variant='outline'
                      w="full"
                    >
                      <Image
                        objectFit='cover'
                        maxW={{ base: '100%', sm: '200px' }}
                        src={project.image}
                        alt={project.title}
                      />
                      <Stack>
                        <CardBody>
                          <Heading size='md'>{project.title}</Heading>
                          <Text py='2'>
                            {project.description}
                          </Text>
                        </CardBody>
                        <CardFooter>
                          <Button variant='solid' colorScheme='blue'>
                            View Details
                          </Button>
                        </CardFooter>
                      </Stack>
                    </Card>
                  ))}
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={8}>
                  {sideProjects.map((project, index) => (
                    <Card
                      key={index}
                      direction={{ base: 'column', sm: 'row' }}
                      overflow='hidden'
                      variant='outline'
                      w="full"
                    >
                      <Image
                        objectFit='cover'
                        maxW={{ base: '100%', sm: '200px' }}
                        src={project.image}
                        alt={project.title}
                      />
                      <Stack>
                        <CardBody>
                          <Heading size='md'>{project.title}</Heading>
                          <Text py='2'>
                            {project.description}
                          </Text>
                        </CardBody>
                        <CardFooter>
                          <Button variant='solid' colorScheme='blue'>
                            Learn More
                          </Button>
                        </CardFooter>
                      </Stack>
                    </Card>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* AI Chatbot */}
        <Box as="section" py={12}>
          <Heading as="h2" size="xl" mb={8}>Chat with Martin AI</Heading>
          <Card bg={colorMode === 'light' ? 'white' : 'gray.700'}>
            <CardBody>
              <VStack spacing={4} mb={4} height="300px" overflowY="auto">
                {chatMessages.map((message, index) => (
                  <Flex key={index} justify={message.role === 'user' ? 'flex-end' : 'flex-start'} width="100%">
                    <Box 
                      maxWidth="70%" 
                      p={3} 
                      borderRadius="lg"
                      bg={message.role === 'user' ? 'blue.500' : (colorMode === 'light' ? 'gray.100' : 'gray.600')}
                      color={message.role === 'user' ? 'white' : (colorMode === 'light' ? 'black' : 'white')}
                    >
                      <Text>{message.content}</Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>
              <form onSubmit={handleChatSubmit}>
                <Flex gap={2}>
                  <Input
                    type="text"
                    placeholder="Ask a design question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                  />
                  <Button type="submit" leftIcon={<Send size={16} />}>
                    Send
                  </Button>
                </Flex>
              </form>
            </CardBody>
          </Card>
        </Box>

        {/* Footer */}
        <Box as="footer" py={8} bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}>
          <Container maxW="container.xl">
            <Flex justify="center" gap={6} mb={4}>
              <Link href="https://github.com/janedoe" target="_blank" rel="noopener noreferrer">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://linkedin.com/in/janedoe" target="_blank" rel="noopener noreferrer">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://twitter.com/janedoe" target="_blank" rel="noopener noreferrer">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </Link>
            </Flex>
            <Text textAlign="center">&copy; 2024 Martin Tejeda. All rights reserved.</Text>
          </Container>
        </Box>
      </Container>
    </Box>
  )
}