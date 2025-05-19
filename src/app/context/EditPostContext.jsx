import React, { createContext, useContext, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
const EditPostContext = createContext();

export const EditPostProvider = ({ children }) => {
  const [activePost, setActivePost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeBook, setActiveBook] = useState(null);
  const [books, setBooks] = useState([]);

  return (
    <EditPostContext.Provider value={{ activePost, setActivePost, posts, setPosts, activeBook, setActiveBook, books, setBooks }}>
      {children}
    </EditPostContext.Provider>
  );
};

export const useEditPostContext = () => useContext(EditPostContext);