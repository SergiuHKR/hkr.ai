-- ============================================================================
-- LMS Schema: courses, modules, lessons, user_progress
-- ============================================================================

-- Courses: top-level learning paths
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  tier text not null default 'beginner' check (tier in ('beginner', 'intermediate', 'advanced')),
  cover_image text,
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Modules: sections within a course
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, slug)
);

-- Lessons: individual content pieces within a module
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  content_md text, -- markdown content
  video_url text,
  duration_minutes int, -- estimated reading/watching time
  xp_reward int not null default 10,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(module_id, slug)
);

-- User progress: tracks which lessons a user has completed
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  xp_earned int not null default 0,
  unique(user_id, lesson_id)
);

-- Indexes for performance
create index idx_modules_course_id on public.modules(course_id);
create index idx_lessons_module_id on public.lessons(module_id);
create index idx_user_progress_user_id on public.user_progress(user_id);
create index idx_user_progress_lesson_id on public.user_progress(lesson_id);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger courses_updated_at before update on public.courses
  for each row execute function public.handle_updated_at();
create trigger modules_updated_at before update on public.modules
  for each row execute function public.handle_updated_at();
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.user_progress enable row level security;

-- Courses, modules, lessons: anyone authenticated can read published content
create policy "Published courses are viewable by authenticated users"
  on public.courses for select
  to authenticated
  using (is_published = true);

create policy "Modules are viewable by authenticated users"
  on public.modules for select
  to authenticated
  using (
    exists (
      select 1 from public.courses
      where courses.id = modules.course_id
      and courses.is_published = true
    )
  );

create policy "Lessons are viewable by authenticated users"
  on public.lessons for select
  to authenticated
  using (
    exists (
      select 1 from public.modules
      join public.courses on courses.id = modules.course_id
      where modules.id = lessons.module_id
      and courses.is_published = true
    )
  );

-- User progress: users can read and insert their own progress
create policy "Users can view their own progress"
  on public.user_progress for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own progress"
  on public.user_progress for insert
  to authenticated
  with check (user_id = auth.uid());

-- Service role can do everything (for admin/seed operations)
-- (service_role bypasses RLS by default, so no explicit policy needed)
