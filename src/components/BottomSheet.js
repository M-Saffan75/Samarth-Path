import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import ActionSheet, { SheetManager } from 'react-native-actions-sheet';

const comments = [
  {
    id: '1',
    user: 'Saffan',
    comment: 'Peace begins when the mind becomes silent.',
  },
  {
    id: '2',
    user: 'Alex',
    comment: 'A calm soul creates a peaceful world.',
  },
  {
    id: '3',
    user: 'Emily',
    comment: 'Silence heals deeper than words.',
  },
];

export default function CommentSheet() {
  return (
    <ActionSheet
      id="comments-sheet"
      gestureEnabled={true}
      closable={true}
      closeOnTouchBackdrop={true}
      indicatorStyle={{
        width: 60,
        backgroundColor: '#ccc',
      }}
      containerStyle={styles.sheet}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Comments</Text>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <Text style={styles.user}>{item.user}</Text>
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Write a comment..."
            style={styles.input}
          />

          <TouchableOpacity style={styles.postBtn}>
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}

export const BottomSheet = () => {
  SheetManager.show('comments-sheet');
};

const styles = StyleSheet.create({
  sheet: {
    height: '90%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  commentBox: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

  user: {
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },

  comment: {
    color: '#444',
    lineHeight: 20,
  },

  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },

  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#f3f3f3',
    borderRadius: 25,
    paddingHorizontal: 15,
  },

  postBtn: {
    marginLeft: 10,
    height: 45,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  postText: {
    color: '#fff',
    fontWeight: '600',
  },
});