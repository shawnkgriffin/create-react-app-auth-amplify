/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProject = `subscription OnCreateProject {
  onCreateProject {
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
export const onUpdateProject = `subscription OnUpdateProject {
  onUpdateProject {
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
export const onDeleteProject = `subscription OnDeleteProject {
  onDeleteProject {
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
export const onCreateProjectTable = `subscription OnCreateProjectTable($id: String) {
  onCreateProjectTable(id: $id) {
    id
  }
}
`;
export const onUpdateProjectTable = `subscription OnUpdateProjectTable($id: String) {
  onUpdateProjectTable(id: $id) {
    id
  }
}
`;
export const onDeleteProjectTable = `subscription OnDeleteProjectTable($id: String) {
  onDeleteProjectTable(id: $id) {
    id
  }
}
`;
