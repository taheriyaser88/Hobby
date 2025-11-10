import { Injectable } from '@angular/core';
import { Event, EventType, EventStatus, EventTask, Session } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private storageKey = 'events';

  getEvents(): Event[] {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (this.isValidEventsStore(parsed)) {
          return parsed as Event[];
        } else {
          console.warn('[EventService] Invalid events shape in localStorage. Seeding defaults.');
        }
      } catch (e) {
        console.warn('[EventService] Failed to parse events from localStorage. Seeding defaults.', e);
      }
    }
    const defaults = this.getDefaultEvents();
    localStorage.setItem(this.storageKey, JSON.stringify(defaults));
    return defaults;
  }

  saveEvent(event: Partial<Event>): Event {
    const events = this.getEvents();
    if (event.id) {
      // Update existing event
      const index = events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        const updatedEvent = {
          ...events[index],
          ...event,
          updatedAt: new Date().toISOString()
        };
        events[index] = updatedEvent;
        localStorage.setItem(this.storageKey, JSON.stringify(events));
        return updatedEvent as Event;
      }
    }
    // Create new event
    const newEvent: Event = {
      ...event,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Event;
    events.push(newEvent);
    localStorage.setItem(this.storageKey, JSON.stringify(events));
    return newEvent;
  }

  getEventById(id: number | string): Event | undefined {
    const events = this.getEvents();
    return events.find(e => e.id === id);
  }

  deleteEvent(id: number | string): void {
    const events = this.getEvents();
    const filteredEvents = events.filter(e => e.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredEvents));
  }

  // Task management methods
  getEventTasks(eventId: number | string): EventTask[] {
    const event = this.getEventById(eventId);
    return event?.tasks || [];
  }

  saveEventTask(eventId: number | string, task: Partial<EventTask>): void {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const event = events[eventIndex];
    if (!event.tasks) {
      event.tasks = [];
    }

    if (task.id) {
      // Update existing task
      const taskIndex = event.tasks.findIndex((t) => t.id === task.id);
      if (taskIndex !== -1) {
        const existingTask = event.tasks[taskIndex];
        event.tasks[taskIndex] = { 
          ...existingTask, 
          ...task,
          id: existingTask.id,
          eventId: existingTask.eventId,
          title: task.title ?? existingTask.title,
          status: task.status ?? existingTask.status,
          priority: task.priority ?? existingTask.priority,
          updatedAt: new Date().toISOString()
        } as EventTask;
      } else {
        // Task not found but has id - validate and create new
        if (task.title && task.status && task.priority && task.id) {
          const newTask: EventTask = {
            id: task.id,
            eventId: eventId,
            title: task.title,
            description: task.description,
            assignee: task.assignee,
            assigneeId: task.assigneeId,
            createdBy: task.createdBy,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            progress: task.progress,
            dependencies: task.dependencies,
            createdAt: task.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          event.tasks.push(newTask);
        } else {
          console.error('Cannot create task: missing required fields or id');
        }
      }
    } else {
      // Create new task
      if (!task.title || !task.status || !task.priority) {
        console.error('Cannot create task: missing required fields (title, status, priority)');
        return;
      }
      const newTask: EventTask = {
        id: Date.now(),
        eventId: eventId,
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        assigneeId: task.assigneeId,
        createdBy: task.createdBy,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        progress: task.progress,
        dependencies: task.dependencies,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      event.tasks.push(newTask);
    }

    event.updatedAt = new Date().toISOString();
    events[eventIndex] = event;
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  deleteEventTask(eventId: number | string, taskId: number | string): void {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const event = events[eventIndex];
    if (event.tasks) {
      event.tasks = event.tasks.filter((t: any) => t.id !== taskId);
      event.updatedAt = new Date().toISOString();
      events[eventIndex] = event;
      localStorage.setItem(this.storageKey, JSON.stringify(events));
    }
  }

  // Session management methods
  getEventSessions(eventId: number | string): Session[] {
    const event = this.getEventById(eventId);
    return event?.sessions || [];
  }

  saveEventSession(eventId: number | string, session: Partial<Session>): void {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const event = events[eventIndex];
    if (!event.sessions) {
      event.sessions = [];
    }

    if (session.id) {
      // Update existing session
      const sessionIndex = event.sessions.findIndex((s) => s.id === session.id);
      if (sessionIndex !== -1) {
        const existingSession = event.sessions[sessionIndex];
        event.sessions[sessionIndex] = {
          ...existingSession,
          ...session,
          id: existingSession.id,
          eventId: existingSession.eventId,
          title: session.title ?? existingSession.title,
          startTime: session.startTime ?? existingSession.startTime,
          endTime: session.endTime ?? existingSession.endTime
        } as Session;
      } else {
        // Session not found but has id - create new
        if (session.title && session.startTime && session.endTime && session.id) {
          const newSession: Session = {
            id: session.id,
            eventId: eventId,
            title: session.title,
            description: session.description,
            speakerId: session.speakerId,
            speakerName: session.speakerName,
            startTime: session.startTime,
            endTime: session.endTime,
            location: session.location,
            capacity: session.capacity,
            attendees: session.attendees,
            materials: session.materials,
            streamingUrl: session.streamingUrl
          };
          event.sessions.push(newSession);
        }
      }
    } else {
      // Create new session
      if (!session.title || !session.startTime || !session.endTime) {
        console.error('Cannot create session: missing required fields (title, startTime, endTime)');
        return;
      }
      const newSession: Session = {
        id: Date.now(),
        eventId: eventId,
        title: session.title,
        description: session.description,
        speakerId: session.speakerId,
        speakerName: session.speakerName,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        capacity: session.capacity,
        attendees: session.attendees,
        materials: session.materials,
        streamingUrl: session.streamingUrl
      };
      event.sessions.push(newSession);
    }

    event.updatedAt = new Date().toISOString();
    events[eventIndex] = event;
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  deleteEventSession(eventId: number | string, sessionId: number | string): void {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const event = events[eventIndex];
    if (event.sessions) {
      event.sessions = event.sessions.filter((s: any) => s.id !== sessionId);
      event.updatedAt = new Date().toISOString();
      events[eventIndex] = event;
      localStorage.setItem(this.storageKey, JSON.stringify(events));
    }
  }

  // Basic runtime validation for seed correctness
  private isValidEventsStore(store: unknown): store is Event[] {
    if (!Array.isArray(store)) return false;
    return store.every(this.isValidEvent);
  }

  private isValidEvent = (e: any): boolean => {
    if (!e || (typeof e !== 'object')) return false;
    const hasCore = ('id' in e) && ('title' in e) && ('status' in e) && ('type' in e);
    const hasDates = ('startAt' in e) || ('endAt' in e) || ('virtualUrl' in e) || ('location' in e);
    const statsOk = !('stats' in e) || (
      e.stats && typeof e.stats === 'object' &&
      ['totalAttendees','checkedInAttendees','totalTicketsSold','totalRevenue'].every(k => k in e.stats)
    );
    return !!hasCore && !!hasDates && !!statsOk;
  };

  private getDefaultEvents(): Event[] {
    return [
      {
        id: 1,
        title: 'کنفرانس مدیریت پروژه',
        slug: 'conf-project-management-1404',
        category: 'business',
        description: 'همایش تخصصی مدیریت پروژه با حضور اساتید برجسته',
        summary: 'همایش تخصصی مدیریت پروژه',
        startAt: '2024-10-20T09:00:00+03:30',
        endAt: '2024-10-20T17:00:00+03:30',
        timezone: 'Asia/Tehran',
        type: EventType.PHYSICAL,
        location: {
          address: 'تهران، هتل اسپیناس',
          city: 'تهران',
          province: 'تهران',
          country: 'ایران',
          venue: 'سالن کنفرانس A'
        },
        status: EventStatus.PUBLISHED,
        team: [
          { userId: 1, role: 'ORGANIZER' as any, permissions: ['ALL'], assignedAt: '2024-09-01T00:00:00Z' },
          { userId: 3, role: 'STAFF' as any, permissions: ['CHECKIN'], assignedAt: '2024-09-05T00:00:00Z' }
        ],
        stats: {
          totalAttendees: 120,
          checkedInAttendees: 95,
          totalTicketsSold: 120,
          totalRevenue: 36000000,
          currency: 'IRR'
        },
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: '2024-09-15T00:00:00Z',
        publishedAt: '2024-09-10T00:00:00Z',
        tasks: [
          {
            id: 1,
            title: 'طراحی پوستر',
            assigneeId: 1,
            assignee: 'سارا جعفری',
            status: 'todo',
            priority: 'high',
            eventId: 1,
            description: 'طراحی پوستر اصلی رویداد',
            createdAt: '2024-09-01T00:00:00Z'
          },
          {
            id: 2,
            title: 'برقراری تماس با اسپانسر',
            assigneeId: 2,
            assignee: 'علی محمدی',
            status: 'todo',
            priority: 'medium',
            eventId: 1,
            description: 'تماس با اسپانسرهای اصلی',
            createdAt: '2024-09-02T00:00:00Z'
          },
          {
            id: 3,
            title: 'تنظیم سالن و تجهیزات',
            assigneeId: 3,
            assignee: 'الهام رضایی',
            status: 'inprogress',
            priority: 'medium',
            eventId: 1,
            description: 'آماده‌سازی سالن و تجهیزات صوتی تصویری',
            createdAt: '2024-09-03T00:00:00Z'
          },
          {
            id: 4,
            title: 'تأیید سخنرانان',
            assigneeId: 2,
            assignee: 'علی محمدی',
            status: 'done',
            priority: 'low',
            eventId: 1,
            description: 'تأیید نهایی لیست سخنرانان',
            createdAt: '2024-09-01T00:00:00Z'
          }
        ]
      },
      {
        id: 2,
        title: 'کارگاه طراحی UI/UX',
        slug: 'workshop-uiux-design-1404',
        category: 'design',
        description: 'کارگاه عملی طراحی رابط کاربری و تجربه کاربری',
        summary: 'کارگاه عملی طراحی UI/UX',
        startAt: '2024-10-28T10:00:00+03:30',
        endAt: '2024-10-28T16:00:00+03:30',
        timezone: 'Asia/Tehran',
        type: EventType.VIRTUAL,
        virtualUrl: 'https://meet.example.com/uiux',
        status: EventStatus.PUBLISHED,
        team: [
          { userId: 2, role: 'COORGANIZER' as any, permissions: ['EDIT'], assignedAt: '2024-09-12T00:00:00Z' }
        ],
        stats: {
          totalAttendees: 80,
          checkedInAttendees: 0,
          totalTicketsSold: 80,
          totalRevenue: 16000000,
          currency: 'IRR'
        },
        createdAt: '2024-09-10T00:00:00Z',
        updatedAt: '2024-10-05T00:00:00Z',
        publishedAt: '2024-10-01T00:00:00Z'
      },
      {
        id: 3,
        title: 'همایش بازاریابی دیجیتال',
        slug: 'digital-marketing-summit-1404',
        category: 'marketing',
        description: 'همایش تخصصی بازاریابی دیجیتال و شبکه‌های اجتماعی',
        summary: 'همایش بازاریابی دیجیتال',
        startAt: '2024-09-16T14:00:00+03:30',
        endAt: '2024-09-16T20:00:00+03:30',
        timezone: 'Asia/Tehran',
        type: EventType.VIRTUAL,
        virtualUrl: 'https://meet.example.com/digital-marketing',
        status: EventStatus.ENDED,
        team: [
          { userId: 3, role: 'STAFF' as any, permissions: ['SUPPORT'], assignedAt: '2024-08-20T00:00:00Z' }
        ],
        stats: {
          totalAttendees: 250,
          checkedInAttendees: 180,
          totalTicketsSold: 250,
          totalRevenue: 0,
          currency: 'IRR'
        },
        createdAt: '2024-08-01T00:00:00Z',
        updatedAt: '2024-09-16T00:00:00Z',
        publishedAt: '2024-08-15T00:00:00Z'
      },
      {
        id: 4,
        title: 'رویداد فناوری آینده',
        slug: 'future-tech-event-1404',
        category: 'technology',
        description: 'رویداد ویژه فناوری‌های نوین و هوش مصنوعی',
        summary: 'رویداد فناوری و هوش مصنوعی',
        startAt: '2024-10-10T09:00:00+03:30',
        endAt: '2024-10-10T17:00:00+03:30',
        timezone: 'Asia/Tehran',
        type: EventType.HYBRID,
        location: {
          address: 'شیراز، پارک علم و فناوری',
          city: 'شیراز',
          province: 'فارس',
          country: 'ایران',
          venue: 'سالن اصلی'
        },
        virtualUrl: 'https://meet.example.com/future-tech',
        status: EventStatus.PUBLISHED,
        team: [
          { userId: 2, role: 'ORGANIZER' as any, permissions: ['ALL'], assignedAt: '2024-09-06T00:00:00Z' }
        ],
        stats: {
          totalAttendees: 300,
          checkedInAttendees: 0,
          totalTicketsSold: 180,
          totalRevenue: 54000000,
          currency: 'IRR'
        },
        createdAt: '2024-09-05T00:00:00Z',
        updatedAt: '2024-09-20T00:00:00Z',
        publishedAt: '2024-09-12T00:00:00Z'
      }
    ];
  }
}

