// Function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards, #in-progress-cards, #done-cards').empty(); // Clear existing cards
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Retrieve tasks from localStorage
  
    tasks.forEach(task => {
      const { title, description, deadline, status } = task;
      
      const taskCard = $(`
        <div class="task-card card mb-2" data-status="${status}">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description}</p>
            <p class="card-text"><small class="text-muted">Deadline: ${dayjs(deadline).format('MM/DD/YYYY')}</small></p>
            <button class="btn btn-danger delete-task">Delete</button>
          </div>
        </div>
      `);
  
      // Color coding for deadlines using Day.js
      const today = dayjs();
      const deadlineDate = dayjs(deadline);
  
      if (deadlineDate.isBefore(today, 'day')) {
        taskCard.addClass('bg-danger text-white'); // Red for overdue tasks
      } else if (deadlineDate.diff(today, 'day') <= 3) {
        taskCard.addClass('bg-warning text-dark'); // Yellow for tasks due within 3 days
      }
  
      $(`#${status}-cards`).append(taskCard);
    });
  
    // Make task cards draggable
    $('.task-card').draggable({
      revert: 'invalid',
      start: function () {
        $(this).css('opacity', '0.5');
      },
      stop: function () {
        $(this).css('opacity', '1');
      }
    });
  }
  
  // Function to handle adding a new task
  function handleAddTask(event) {
    event.preventDefault();
    const title = $('#task-title').val();
    const description = $('#task-desc').val();
    const deadline = $('#task-deadline').val();
    const status = 'todo'; // Default status for new tasks
  
    if (!title || !deadline) return;
  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ title, description, deadline, status });
  
    localStorage.setItem('tasks', JSON.stringify(tasks));
    $('#formModal').modal('hide');
    renderTaskList();
  }
  
  // Function to handle deleting a task
  function handleDeleteTask(event) {
    const taskTitle = $(event.target).closest('.task-card').find('.card-title').text();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.title !== taskTitle);
  
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
  }
  
  // Function to handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    const taskTitle = $(ui.draggable).find('.card-title').text();
    const newStatus = $(this).attr('id');
  
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.title === taskTitle);
    task.status = newStatus;
  
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTaskList();
  }
  
  $(document).ready(function () {
    renderTaskList();
  
    // Event listener for adding a new task
    $('#save-task').on('click', handleAddTask);
  
    // Event listener for deleting a task
    $(document).on('click', '.delete-task', handleDeleteTask);
  
    // Enable lanes to accept dropped tasks
    $('#to-do, #in-progress, #done').droppable({
      accept: '.task-card',
      drop: handleDrop
    });
  });
  