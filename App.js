import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import styled from 'styled-components/native';

import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { Ionicons } from '@expo/vector-icons';

import { ITEM_WIDTH, getCalendarColumns } from './src/util';
import { useTodoList } from './src/hook/useTodoList';
import useCalendar from './src/hook/useCalendar';

import Calendar from './src/Calendar';
import Margin from './src/hook/Margin';
import AddTodoInput from './src/AddTodoInput';
import { useRef } from 'react';

const MainContainer = styled.Pressable`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  /* padding-top: ${(props) => (props.isAos ? 40 : undefined)}px; */
`;

export default function App() {
  const now = dayjs();

  const {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    handleConfirm,
    hideDatePicker,
    showDatePicker,
  } = useCalendar(now);

  const {
    todoList,
    filteredTodoList,
    input,
    setInput,
    addTodo,
    removeTodo,
    toggleTodo,
    resetInput,
  } = useTodoList(selectedDate);

  const columns = getCalendarColumns(selectedDate);

  const flatListRef = useRef(null);

  const onPressArrow = (direction) => {
    direction === 'left'
      ? setSelectedDate(dayjs(selectedDate).subtract(1, 'M'))
      : setSelectedDate(dayjs(selectedDate).add(1, 'M'));
  };

  const scrollToEndFun = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
  };

  const onPressAdd = () => {
    if (input !== '') {
      addTodo();
      resetInput();
      scrollToEndFun();
    }
  };

  const onSubmitEditing = () => {
    if (input !== '') {
      addTodo();
      resetInput();
      scrollToEndFun();
    }
  };

  const onFocus = () => {
    scrollToEndFun();
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        <Calendar
          todoList={todoList}
          columns={columns}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onPressArrow={onPressArrow}
          showDatePicker={showDatePicker}
        />
        <Margin height={15} />
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 4 / 2,
            backgroundColor: '#a3a3a3',
            alignSelf: 'center',
          }}
        />
        <Margin height={15} />
      </View>
    );
  };

  const renderItem = ({ item: todo }) => {
    const isSuccess = todo.isSuccess;
    const onPress = () => {
      toggleTodo(todo.id);
    };
    const onLongPress = () => {
      Alert.alert('삭제하시겠어요?', '', [
        {
          style: 'cancel',
          text: '아니요',
        },
        {
          text: '네',
          onPress: () => removeTodo(todo.id),
        },
      ]);
    };

    return (
      <Pressable
        style={{
          flexDirection: 'row',
          width: ITEM_WIDTH,
          alignSelf: 'center',
          paddingVertical: 10,
          paddingHorizontal: 5,
          borderBottomWidth: 0.2,
          borderColor: '#a6a6a6',
        }}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <Text style={{ flex: 1, fontSize: 14, color: '#595959' }}>
          {todo.content}
        </Text>
        <Ionicons
          name="ios-checkmark"
          size={17}
          color={isSuccess ? '#595959' : '#bfbfbf'}
        />
      </Pressable>
    );
  };

  return (
    <MainContainer isAos={Platform.OS} onPress={Keyboard.dismiss}>
      <Image
        source={{
          uri: 'https://img.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1373-159.jpg?w=1060&t=st=1667524235~exp=1667524835~hmac=8a3d988d6c33a32017e280768e1aa4037b1ec8078c98fe21f0ea2ef361aebf2c',
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ marginBottom: Platform.OS === 'ios' ? 50 : 10 }}
      >
        <>
          <View>
            <FlatList
              ref={flatListRef}
              data={filteredTodoList}
              ListHeaderComponent={ListHeaderComponent}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingTop: Platform.OS === 'ios' ? 60 : 45,
              }}
              keyExtractor={(_, index) => index}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />

            <AddTodoInput
              value={input}
              onChangeText={setInput}
              placeholder={`${dayjs(selectedDate).format(
                'MM.DD'
              )}에 추가할 투두`}
              onPressAdd={onPressAdd}
              onSubmitEditing={onSubmitEditing}
              onFocus={onFocus}
            />
          </View>
        </>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </MainContainer>
  );
}
