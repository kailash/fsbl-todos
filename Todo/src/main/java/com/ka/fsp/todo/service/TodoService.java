package com.ka.fsp.todo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ka.fsp.todo.domain.Todo;
import com.ka.fsp.todo.entity.TodoEntity;
import com.ka.fsp.todo.repository.TodoRepository;

@Service
public class TodoService {
	
	public static int[] fibArray= { 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233};
	
	@Autowired
	TodoRepository todoRepository;
	
	public List<TodoEntity> getAll(){
		return todoRepository.findAll();
	}
	
	
	public List<TodoEntity> getAllPending(){
		Sort sortByCreatedAtDesc = Sort.by(Sort.Direction.DESC, "createdAt");
		return todoRepository.findByCompletedFalse(sortByCreatedAtDesc);
	}
	
	
	public List<TodoEntity> getRivision4Date(LocalDate date){
		return todoRepository.findByNextRevisionDateAndCompletedTrue(date);
	}
	
	public TodoEntity save(Todo todo) {
		TodoEntity todoEntity=new TodoEntity();
		todoEntity.setId(todo.getId());
		todoEntity.setTitle(todo.getTitle());
		todoEntity.setRevisionIeration(0);
		todoEntity.setFuture(todo.isFuture());
		todoEntity.setLearning(todo.isLearning());
		todoEntity.setWork(todo.isWork());
		todoEntity.setPersonal(todo.isPersonal());
		//todoEntity.setNextRevision(todo.getCreatedAt().plusDays(1));
		todoEntity.setCompleted(false);
		
		return todoRepository.save(todoEntity);
	}
	
	
	public Optional<TodoEntity> updateTitleAndRevision(String id,Todo todo) {
		return todoRepository.findById(id)
					  .map(todoData ->{
						  int revisionItr=todoData.getRevisionIeration();
						  todoData.setTitle(todo.getTitle());
						  todoData.setCompleted(true);
						  todoData.setRevisionIeration(revisionItr+1);
						  int daysToAdd=fibArray[revisionItr%12];
						  LocalDate nextRevisionItrDate=LocalDate.now().plusDays(daysToAdd);
						  todoData.setNextRevision(nextRevisionItrDate);
						  return todoRepository.save(todoData);
					  });
	}
	
	
	public Optional<TodoEntity> updateTitle(String id,Todo todo) {
		return todoRepository.findById(id)
					  .map(todoData ->{
						  todoData.setTitle(todo.getTitle());
						  return todoRepository.save(todoData);
					  });
	}
	
}
