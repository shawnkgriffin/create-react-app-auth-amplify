/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProject = `query GetProject($id: ID!) {
  getProject(id: $id) {
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
export const listProjects = `query ListProjects(
  $filter: ModelProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      }
      stepTypes
    }
    nextToken
  }
}
`;
