/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProject = `mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    help
    creator
    end
    start
    note
    problemOpportunity
    projectManager
    sponsor
    steps {
      name
      help
      note
      skip
      stepType
      questions {
        name
        help
        note
        skip
        answer
        validAnswers
      }
    }
    stepTypes
  }
}
`;
export const updateProject = `mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    id
    name
    help
    creator
    end
    start
    note
    problemOpportunity
    projectManager
    sponsor
    steps {
      name
      help
      note
      skip
      stepType
      questions {
        name
        help
        note
        skip
        answer
        validAnswers
      }
    }
    stepTypes
  }
}
`;
export const deleteProject = `mutation DeleteProject($input: DeleteProjectInput!) {
  deleteProject(input: $input) {
    id
    name
    help
    creator
    end
    start
    note
    problemOpportunity
    projectManager
    sponsor
    steps {
      name
      help
      note
      skip
      stepType
      questions {
        name
        help
        note
        skip
        answer
        validAnswers
      }
    }
    stepTypes
  }
}
`;
export const createProjectTable = `mutation CreateProjectTable($input: CreateProjectTableInput!) {
  createProjectTable(input: $input) {
    id
  }
}
`;
export const updateProjectTable = `mutation UpdateProjectTable($input: UpdateProjectTableInput!) {
  updateProjectTable(input: $input) {
    id
  }
}
`;
export const deleteProjectTable = `mutation DeleteProjectTable($input: DeleteProjectTableInput!) {
  deleteProjectTable(input: $input) {
    id
  }
}
`;
