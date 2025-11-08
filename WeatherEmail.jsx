// import {
//     Html,
//     Head,
//     Body,
//     Container,
//     Section,
//     Text,
//     Heading,
// } from "@react-email/components";

// export function WeatherEmail({ weatherData }) {
//     return (
//         <Html>
//             <Head />
//             <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "Arial, sans-serif" }}>
//                 <Container style={{ margin: "0 auto", padding: "20px 0", maxWidth: "600px" }}>
//                     <Section
//                         style={{
//                             backgroundColor: "#ffffff",
//                             borderRadius: "10px",
//                             padding: "40px",
//                             boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                         }}
//                     >
//                         <Heading
//                             style={{
//                                 color: "#667eea",
//                                 textAlign: "center",
//                                 fontSize: "28px",
//                                 marginBottom: "30px",
//                             }}
//                         >
//                             🌤️ Your Weather Report
//                         </Heading>

//                         {weatherData.map((item, index) => (
//                             <Section
//                                 key={index}
//                                 style={{
//                                     backgroundColor: "#f9f9f9",
//                                     padding: "20px",
//                                     margin: "15px 0",
//                                     borderRadius: "8px",
//                                     borderLeft: "4px solid #667eea",
//                                 }}
//                             >
//                                 <Text
//                                     style={{
//                                         fontSize: "20px",
//                                         fontWeight: "bold",
//                                         margin: "0 0 10px 0",
//                                         color: "#333",
//                                     }}
//                                 >
//                                     📍 {item.city}
//                                 </Text>
//                                 <Text
//                                     style={{
//                                         fontSize: "16px",
//                                         color: "#555",
//                                         margin: "0",
//                                     }}
//                                 >
//                                     {item.weather}
//                                 </Text>
//                             </Section>
//                         ))}

//                         <Text
//                             style={{
//                                 textAlign: "center",
//                                 color: "#888",
//                                 fontSize: "12px",
//                                 marginTop: "30px",
//                             }}
//                         >
//                             Powered by Weather Agent • {new Date().toLocaleDateString()}
//                         </Text>
//                     </Section>
//                 </Container>
//             </Body>
//         </Html>
//     );
// }