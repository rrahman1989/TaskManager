package com.manage.task.web.rest;

import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.NoSuchMessageException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.thymeleaf.spring5.SpringTemplateEngine;

import com.manage.task.domain.Task;
import com.manage.task.domain.User;
import com.manage.task.repository.TaskRepository;
import com.manage.task.security.AuthoritiesConstants;
import com.manage.task.security.SecurityUtils;
import com.manage.task.service.MailService;
import com.manage.task.service.MailUtility;
import com.manage.task.service.UserService;
import com.manage.task.web.rest.errors.BadRequestAlertException;

import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.manage.task.domain.Task}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TaskResource {

	private final Logger log = LoggerFactory.getLogger(TaskResource.class);

	private static final String ENTITY_NAME = "task";

	@Value("${jhipster.clientApp.name}")
	private String applicationName;

	private final TaskRepository taskRepository;

	private UserService us;

	public TaskResource(TaskRepository taskRepository) {
		this.taskRepository = taskRepository;

	}

	/**
	 * {@code POST  /tasks} : Create a new task.
	 *
	 * @param task the task to create.
	 * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
	 *         body the new task, or with status {@code 400 (Bad Request)} if the
	 *         task has already an ID.
	 * @throws URISyntaxException if the Location URI syntax is incorrect.
	 */
	@PostMapping("/tasks")
	public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) throws URISyntaxException {

		log.debug("Just Sent the test Mail", task);

		log.debug("REST request to save Task : {}", task);

		log.debug("Get user ID: " + task.getUser().getId());

		String emailAddress = taskRepository.getEmailAddress(task.getUser().getId());

		log.debug("Get user Email: " + emailAddress);

		log.debug("Get user Login: " + task.getUser().getLogin());

		log.debug("Task Descriptions: " + task.toString());
		
		String getEmailAddressByName = taskRepository.getEmailAddressByUserName(task.getUser().getLogin());
		
		log.debug("We are getting user email address by name: " + getEmailAddressByName);

		if (task.getId() != null) {
			throw new BadRequestAlertException("A new task cannot already have an ID", ENTITY_NAME, "idexists");
		}
		Task result = taskRepository.save(task);
		

		MailUtility.sendEmail(getEmailAddressByName, "There is a task that has been assigned to you",
				task.toString(), false, false);
		


		return ResponseEntity
				.created(new URI("/api/tasks/" + result.getId())).headers(HeaderUtil
						.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
				.body(result);
	}

	/**
	 * {@code PUT  /tasks/:id} : Updates an existing task.
	 *
	 * @param id   the id of the task to save.
	 * @param task the task to update.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
	 *         the updated task, or with status {@code 400 (Bad Request)} if the
	 *         task is not valid, or with status {@code 500 (Internal Server Error)}
	 *         if the task couldn't be updated.
	 * @throws URISyntaxException if the Location URI syntax is incorrect.
	 */
	@PutMapping("/tasks/{id}")
	public ResponseEntity<Task> updateTask(@PathVariable(value = "id", required = false) final Long id,
			@Valid @RequestBody Task task) throws URISyntaxException {
		log.debug("REST request to update Task : {}, {}", id, task);
		if (task.getId() == null) {
			throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
		}
		if (!Objects.equals(id, task.getId())) {
			throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
		}

		if (!taskRepository.existsById(id)) {
			throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
		}

		Task result = taskRepository.save(task);
		return ResponseEntity.ok().headers(
				HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, task.getId().toString()))
				.body(result);
	}

	/**
	 * {@code PATCH  /tasks/:id} : Partial updates given fields of an existing task,
	 * field will ignore if it is null
	 *
	 * @param id   the id of the task to save.
	 * @param task the task to update.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
	 *         the updated task, or with status {@code 400 (Bad Request)} if the
	 *         task is not valid, or with status {@code 404 (Not Found)} if the task
	 *         is not found, or with status {@code 500 (Internal Server Error)} if
	 *         the task couldn't be updated.
	 * @throws URISyntaxException if the Location URI syntax is incorrect.
	 */
	@PatchMapping(value = "/tasks/{id}", consumes = { "application/json", "application/merge-patch+json" })
	public ResponseEntity<Task> partialUpdateTask(@PathVariable(value = "id", required = false) final Long id,
			@NotNull @RequestBody Task task) throws URISyntaxException {
		log.debug("REST request to partial update Task partially : {}, {}", id, task);
		if (task.getId() == null) {
			throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
		}
		if (!Objects.equals(id, task.getId())) {
			throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
		}

		if (!taskRepository.existsById(id)) {
			throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
		}

		Optional<Task> result = taskRepository.findById(task.getId()).map(existingTask -> {
			if (task.getTaskName() != null) {
				existingTask.setTaskName(task.getTaskName());
			}
			if (task.getStartDate() != null) {
				existingTask.setStartDate(task.getStartDate());
			}
			if (task.getEndDate() != null) {
				existingTask.setEndDate(task.getEndDate());
			}
			if (task.getDescription() != null) {
				existingTask.setDescription(task.getDescription());
			}

			return existingTask;
		}).map(taskRepository::save);

		return ResponseUtil.wrapOrNotFound(result,
				HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, task.getId().toString()));
	}

	/**
	 * {@code GET  /tasks} : get all the tasks.
	 *
	 * @param pageable  the pagination information.
	 * @param eagerload flag to eager load entities from relationships (This is
	 *                  applicable for many-to-many).
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
	 *         of tasks in body.
	 */
	@GetMapping("/tasks")
	public ResponseEntity<List<Task>> getAllTasks(@org.springdoc.api.annotations.ParameterObject Pageable pageable,
			@RequestParam(required = false, defaultValue = "true") boolean eagerload) {
		log.debug("REST request to get a page of Tasks");
		Page<Task> page = null;
		List<Task> taskPage;
		if (eagerload) {
			page = taskRepository.findAllWithEagerRelationships(pageable);
		}
		if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) {
			taskRepository.findAll();

		} else {
			page = taskRepository.findByUserIsCurrentUser(pageable);
		}

		HttpHeaders headers = PaginationUtil
				.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);

		return ResponseEntity.ok().headers(headers).body(page.getContent());
	}

//    @GetMapping("/posts")
//    public ResponseEntity<List<Task>> getAllPosts(
//        Pageable pageable,
//        @RequestParam(required = false, defaultValue = "false") boolean eagerload
//    ) {
//        log.debug("REST request to get a page of Posts: " + SecurityUtils.getCurrentUserLogin().toString());
//        Page<Task> page = taskRepository.findByBlogUserLoginOrderByDateDesc(SecurityUtils.getCurrentUserLogin().orElse(null), pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
//        return ResponseEntity.ok().headers(headers).body(page.getContent());
//    }

	/*
	 * @GetMapping("/taskswithAdmin") public List<Task>getAllTasks() {
	 * 
	 * 
	 * 
	 * //String emailAddress = us.getUserWithAuthorities().get().getEmail();
	 * 
	 * //String login = SecurityUtils.getCurrentUserLogin().orElse("anonymoususer");
	 * 
	 * 
	 * log.debug("We are here: " );
	 * 
	 * 
	 * // MailUtility.sendEmail("rahman.reazur@yahoo.com", "Test Subject",
	 * "Test Body", "rahman.reazur1989@gmail.com", "Never143"); // // if
	 * (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)) { // return
	 * taskRepository.findAll(); // // } else { // return
	 * taskRepository.findByUserIsCurrentUser(); // } //
	 * 
	 * 
	 * 
	 * }
	 */

	/**
	 * {@code GET  /tasks/:id} : get the "id" task.
	 *
	 * @param id the id of the task to retrieve.
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
	 *         the task, or with status {@code 404 (Not Found)}.
	 */
	@GetMapping("/tasks/{id}")
	public ResponseEntity<Task> getTask(@PathVariable Long id) {
		log.debug("REST request to get Task : {}", id);
		Optional<Task> task = taskRepository.findOneWithEagerRelationships(id);
		return ResponseUtil.wrapOrNotFound(task);
	}

	/**
	 * {@code DELETE  /tasks/:id} : delete the "id" task.
	 *
	 * @param id the id of the task to delete.
	 * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
	 */
	@DeleteMapping("/tasks/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
		log.debug("REST request to delete Task : {}", id);
		taskRepository.deleteById(id);
		return ResponseEntity.noContent()
				.headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
				.build();
	}

}
