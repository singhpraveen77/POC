export const validateWorkspace = ({ name, slug }) => {
  const errors = {};
  if (!name || name.trim().length === 0) {
    errors.name = "Workspace name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (name.trim().length > 80) {
    errors.name = "Name cannot exceed 80 characters";
  }
  if (!slug || slug.trim().length === 0) {
    errors.slug = "Workspace slug is required";
  } else if (!/^[a-z0-9-]+$/.test(slug.trim())) {
    errors.slug = "Slug must be lowercase letters, numbers and hyphens only";
  } else if (slug.trim().length < 2) {
    errors.slug = "Slug must be at least 2 characters";
  } else if (slug.trim().length > 60) {
    errors.slug = "Slug cannot exceed 60 characters";
  }
  return errors;
};
export const validateBoard = ({ name }) => {
  const errors = {};
  if (!name || name.trim().length === 0) {
    errors.name = "Board name is required";
  } else if (name.trim().length < 1) {
    errors.name = "Board name is required";
  } else if (name.trim().length > 80) {
    errors.name = "Name cannot exceed 80 characters";
  }
  return errors;
};
export const validateColumn = ({ name }) => {
  const errors = {};
  if (!name || name.trim().length === 0) {
    errors.name = "Column name is required";
  } else if (name.trim().length > 60) {
    errors.name = "Name cannot exceed 60 characters";
  }
  return errors;
};
export const validateTask = ({ title }) => {
  const errors = {};
  if (!title || title.trim().length === 0) {
    errors.title = "Task title is required";
  } else if (title.trim().length > 200) {
    errors.title = "Title cannot exceed 200 characters";
  }
  return errors;
};
export const hasErrors = (errors) => Object.keys(errors).length > 0;