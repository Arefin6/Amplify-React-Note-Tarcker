/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNotes = /* GraphQL */ `
  subscription OnCreateNotes($owner: String!) {
    onCreateNotes(owner: $owner) {
      id
      notes
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateNotes = /* GraphQL */ `
  subscription OnUpdateNotes($owner: String!) {
    onUpdateNotes(owner: $owner) {
      id
      notes
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteNotes = /* GraphQL */ `
  subscription OnDeleteNotes($owner: String!) {
    onDeleteNotes(owner: $owner) {
      id
      notes
      createdAt
      updatedAt
      owner
    }
  }
`;
