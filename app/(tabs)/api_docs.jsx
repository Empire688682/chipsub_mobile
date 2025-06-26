import { ScrollView, Text } from "react-native"


const ApiDocs = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      {
        Array.from({ length: 20 }).map((_, idx) => (
          <Text key={idx}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure nihil ratione ea voluptates dicta repellendus voluptatum repellat, ipsum illum inventore asperiores culpa ipsa. Inventore tempora laudantium esse, molestias eos cumque!
          </Text>
        ))
      }
    </ScrollView>
  )
}

export default ApiDocs
