package com.manage.task.repository;

import com.manage.task.domain.Task;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Task entity.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("select task from Task task where task.user.login = ?#{principal.username}")
    Page<Task> findByUserIsCurrentUser(Pageable pageable);

    default Optional<Task> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Task> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Task> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct task from Task task left join fetch task.user left join fetch task.status left join fetch task.priority left join fetch task.project",
        countQuery = "select count(distinct task) from Task task"      
    )
    Page<Task> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct task from Task task left join fetch task.user left join fetch task.status left join fetch task.priority left join fetch task.project"
    )
    List<Task> findAllWithToOneRelationships();

    @Query(
        "select task from Task task left join fetch task.user left join fetch task.status left join fetch task.priority left join fetch task.project where task.id =:id"
    )
    Optional<Task> findOneWithToOneRelationships(@Param("id") Long id);
    
    @Query(value = "SELECT JHI_USER.EMAIL \n"
    		+ "FROM JHI_USER JOIN TASK ON\n"
    		+ "JHI_USER.ID = ?1 ", nativeQuery = true)
    String getEmailAddress(Long userId);
    
    
    @Query(value = "SELECT JHI_USER.EMAIL\n"
    		+ "FROM JHI_USER where LOGIN = ?1", nativeQuery = true)
    String getEmailAddressByUserName(String userName);
    

    
	
}