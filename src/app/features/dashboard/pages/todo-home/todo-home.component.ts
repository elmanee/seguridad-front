import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../../core/services/alert.service';
import { OnlyAlphanumericDirective } from '../../../../shared/directives/only-alphanumeric.directive';


@Component({
  selector: 'app-todo-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnlyAlphanumericDirective],
  templateUrl: './todo-home.component.html'
})
export class TodoHomeComponent implements OnInit {
  private taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private alertSvc = inject(AlertService);

  tasks: Task[] = [];
  isEditing = false;
  selectedTaskId: number | null = null;

  taskForm = this.fb.group({
    name: ['', 
      [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(250)
      ]
    ],
    description: ['', 
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250)
      ]
    ],
    priority: [false]
  });

  ngOnInit() { this.loadTasks(); }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => this.tasks = data);
  }

  openEdit(task: Task) {
    this.isEditing = true;
    this.selectedTaskId = task.id;
    this.taskForm.patchValue({
      name: task.name,
      description: task.description,
      priority: task.priority
    });
  }

  openCreate() {
    this.isEditing = false;
    this.selectedTaskId = null;
    this.taskForm.reset({ priority: false });
  }

  saveTask() {
    if (this.taskForm.invalid) return;

    const formValue = {
      ...this.taskForm.value,
      name: this.taskForm.value.name?.trim(),
      description: this.taskForm.value.description?.trim()
    };

    if ((formValue.name?.length || 0) < 3) {
      this.alertSvc.error('El nombre debe tener al menos 3 caracteres reales');
      return;
    }

    const request = (this.isEditing && this.selectedTaskId)
      ? this.taskService.updateTask(this.selectedTaskId, formValue)
      : this.taskService.createTask(formValue);

    request.subscribe({
      next: () => {
        const msg = this.isEditing ? 'Tarea actualizada' : 'Tarea creada correctamente';
        this.alertSvc.success(msg);
        this.loadTasks();
        this.taskForm.reset();
      },
      error: (err) => console.error("Error en la operación", err)
    });
  }

  deleteTask(id: number) {
    this.alertSvc.confirm(
    '¿Borrar tarea?',
    'Esta acción no se puede deshacer.',
    'Eliminar',
    'Cancelar'
  ).then(confirmed => {
    if (confirmed) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.alertSvc.success('Tarea eliminada');
          this.loadTasks();
        }
      })
    }
  })
  }
}
