import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';

const { width } = Dimensions.get('window');

const dummyPosts = [
  {
    id: 1,
    title: 'How to Save Data in Nigeria 💡',
    excerpt: "Data prices are crazy right now, but here's how to beat the system and save some MBs daily...",
    date: 'April 10, 2025',
  },
  {
    id: 2,
    title: 'Why Chipsub is the Smartest Move This Year 🔥',
    excerpt: "Forget paying full price — Chipsub helps you get data at discounted rates. Here's why people are switching...",
    date: 'April 5, 2025',
  },
  {
    id: 3,
    title: 'Integrate Our API in 5 Mins',
    excerpt: "Dev-friendly guide to getting started with Chipsub's API for resellers and app developers.",
    date: 'March 29, 2025',
  },
];

const Blog = () => {
  const handlePostPress = (post) => {
    // Handle post navigation here
    console.log('Post pressed:', post.title);
    // You can navigate to a detailed post screen
    // navigation.navigate('PostDetail', { post });
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.title}>Latest on the Blog</Text>
      <Text style={styles.subtitle}>
        Tips, updates, and stories from the Chipsub community.
      </Text>
    </View>
  );

  const renderBlogPost = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.postCard,
        width > 600 ? styles.postCardTablet : styles.postCardMobile
      ]}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postExcerpt}>{item.excerpt}</Text>
      <Text style={styles.postDate}>{item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyPosts}
        renderItem={renderBlogPost}
        keyExtractor={(item) => item.id.toString()}
        numColumns={width > 600 ? 2 : 1}
        key={width > 600 ? 'tablet' : 'mobile'} // Force re-render on orientation change
        columnWrapperStyle={width > 600 ? styles.row : null}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postCardMobile: {
    marginHorizontal: 20,
  },
  postCardTablet: {
    flex: 1,
    marginHorizontal: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 28,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  postDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});

export default Blog;