import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultTodoList = [
  // {
  //   id: 1,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 2,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 3,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 4,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 5,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 6,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 7,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 8,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 9,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 10,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 11,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 12,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 13,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 14,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 15,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 16,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 17,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 18,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 19,
  //   content: '운동하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
  // {
  //   id: 20,
  //   content: '공부하기',
  //   date: dayjs(),
  //   isSuccess: false,
  // },
  // {
  //   id: 21,
  //   content: 'RN 강의 수강하기',
  //   date: dayjs(),
  //   isSuccess: true,
  // },
];

const TODO_LIST_KEY = 'TODO_LIST_KEY';

export const useTodoList = (selectedDate) => {
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [input, setInput] = useState('');

  const resetInput = () => setInput('');

  const saveTodoList = (newTodoList) => {
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList));
  };

  const addTodo = () => {
    const lastId =
      todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1;

    const newTodoList = [
      ...todoList,
      {
        id: lastId,
        content: input,
        date: selectedDate,
        isSuccess: false,
      },
    ];

    saveTodoList(newTodoList);
  };

  const removeTodo = (todoId) => {
    const newTodoList = todoList.filter((todo) => todo.id !== todoId);

    saveTodoList(newTodoList);
  };

  const toggleTodo = (todoId) => {
    const newTodoList = todoList.map((todo) => {
      if (todo.id !== todoId) return todo;
      return {
        ...todo,
        isSuccess: !todo.isSuccess,
      };
    });

    saveTodoList(newTodoList);
  };

  const filteredTodoList = todoList.filter((todo) => {
    const isSameDate = dayjs(todo.date).isSame(selectedDate, 'date');
    return isSameDate;
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const result = await AsyncStorage.getItem(TODO_LIST_KEY);

    if (result) {
      const newTodoList = JSON.parse(result);
      setTodoList(newTodoList);
    }
  };

  return {
    filteredTodoList,
    todoList,
    setTodoList,
    input,
    setInput,
    addTodo,
    removeTodo,
    toggleTodo,
    resetInput,
  };
};
