const BASE_URL = '/api/students';

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      // keep the default message when the body is not JSON
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export function fetchStudents({ q, course, status, minGpa, maxGpa } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (course && course !== 'All courses') params.set('course', course);
  if (status && status !== 'Any status') params.set('status', status);
  if (minGpa !== undefined) params.set('minGpa', String(minGpa));
  if (maxGpa !== undefined) params.set('maxGpa', String(maxGpa));

  const queryString = params.toString();
  return request(`${BASE_URL}${queryString ? `?${queryString}` : ''}`);
}

export function createStudent(student) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

export function updateStudentStatus(id, status) {
  return request(`${BASE_URL}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteStudent(id) {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}