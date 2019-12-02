import React, { Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import { Table } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ProjectWorkPackageQuestionMenu from './ProjectWorkPackageQuestionMenu';
import Input from '@material-ui/core/Input';
import * as utils from '../utils/generalUtilities.js';

const StyledTableCell = withStyles(theme => ({
  head: {
    whiteSpace: 'noWrap',
    align: 'left',
    padding: '6px 6px 6px 6px',
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    whiteSpace: 'noWrap',
    align: 'left',
    padding: '6px 6px 6px 6px',
    fontSize: 16,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

export default function ProjectWorkPackages({
  projectList,
  project,
  currentProject,
  currentDeliverable,
  currentWorkPackage,
  handleWorkPackageChange,
  handleMenu,
  classes,
}) {
  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    let cellInfo = e.target.id.split('.');
    let deliverable = parseInt(cellInfo[1], 10);
    let workPackage = parseInt(cellInfo[2], 10);
    if (isNaN(deliverable) || isNaN(workPackage)) {
      console.log(`ProjectWorkPackages.handleClick(e) invalid`);
      handleWorkPackageChange(0, 0);
      return;
    }

    if (deliverable < 0 || deliverable >= project.deliverables.length)
      deliverable = 0;
    if (
      workPackage < 0 ||
      workPackage >=
        project.deliverables[deliverable].workPackages.length
    )
      workPackage = 0;
    console.log(
      `${e.target.id} deliverable ${deliverable} workPackage ${workPackage}`,
    );
    handleWorkPackageChange(deliverable, workPackage);
  }

  let deliverableRows = [];
  // project.deliverables determines the number of columns.
  // deliverableRows will be a table with the contents of each workpackage in the table.
  project.deliverables.map(
    (deliverable, index) => (deliverableRows[index] = []),
  );

  // Build each Step label for each step type as we have to lay them out in rows.
  project.deliverables.forEach((deliverable, deliverableIndex) => {
    deliverable.workPackages.forEach(
      (workPackage, workPackageIndex) => {
        const percentageComplete = utils.percentageQuestionsYes(
          workPackage.questions,
        );
        const workPackageColor = workPackage.completed
          ? 'green'
          : workPackage.started
          ? 'blue'
          : 'black';

        deliverableRows[deliverableIndex].push({
          workPackageIndex: workPackageIndex,
          deliverableIndex: deliverableIndex,
          workPackageString: `${workPackage.name} (${percentageComplete})`,
          workPackageColor: workPackageColor,
        });
      },
    );
  });
  const maxWorkPackageRows = Math.max(
    ...deliverableRows.map(workPackages => workPackages.length),
  );

  let tableRows = []; // the columns have different numbers of steps associated with them
  for (let rowIndex = 0; rowIndex < maxWorkPackageRows; rowIndex++) {
    tableRows.push(
      <StyledTableRow key={`Row${rowIndex}`}>
        {project.deliverables.map((deliverable, deliverableIndex) => {
          return (
            <StyledTableCell
              key={
                rowIndex * project.deliverables.length +
                deliverableIndex
              }
              id={`cell-step.${deliverableIndex}.${rowIndex}`}
              variant="body"
            >
              {rowIndex <
                deliverableRows[deliverableIndex].length && (
                <Fragment>
                  <ProjectWorkPackageQuestionMenu
                    currentProject={currentProject}
                    typeOfMenu={'work package'}
                    menuIndex={`${deliverableIndex}.${rowIndex}`}
                    handleMenu={handleMenu}
                  />

                  <Input
                    onClick={handleClick}
                    disableUnderline
                    multiline
                    value={
                      deliverableRows[deliverableIndex][rowIndex]
                        .workPackageString
                    }
                    id={`work-package-input.${deliverableIndex}.${rowIndex}`}
                    style={{
                      width: '90%',
                      fontWeight:
                        rowIndex <
                          deliverableRows[deliverableIndex].length &&
                        deliverableRows[deliverableIndex][rowIndex]
                          .deliverableIndex === currentDeliverable &&
                        deliverableRows[deliverableIndex][rowIndex]
                          .workPackageIndex === currentWorkPackage
                          ? 'bold'
                          : 'normal',
                      fontSize:
                        rowIndex <
                          deliverableRows[deliverableIndex].length &&
                        deliverableRows[deliverableIndex][rowIndex]
                          .deliverableIndex === currentDeliverable &&
                        deliverableRows[deliverableIndex][rowIndex]
                          .workPackageIndex === currentWorkPackage
                          ? 18
                          : 16,
                      color:
                        deliverableRows[deliverableIndex][rowIndex]
                          .workPackageColor,
                    }}
                  />
                </Fragment>
              )}
            </StyledTableCell>
          );
        })}
      </StyledTableRow>,
    );
  }
  let tableHeaders = [];
  project.deliverables.forEach((deliverable, deliverableIndex) => {
    const percentageComplete = utils.percentageDeliverableQuestionsYes(
      deliverable,
    );
    // all work packages started = false => white
    // all work packages completed = true => lightgreen
    // else in progress => lightblue
    const stepHeadLabelStyle = {
      width: '90%',
      fontSize: 16,
      color:
        deliverableRows[deliverableIndex].findIndex(
          workPackage => workPackage.workPackageColor === 'blue',
        ) === -1 &&
        deliverableRows[deliverableIndex].findIndex(
          workPackage => workPackage.workPackageColor === 'green',
        ) === -1
          ? 'white'
          : deliverableRows[deliverableIndex].findIndex(
              workPackage => workPackage.workPackageColor === 'blue',
            ) === -1 &&
            deliverableRows[deliverableIndex].findIndex(
              workPackage => workPackage.workPackageColor === 'black',
            ) === -1
          ? 'lightgreen'
          : 'lightskyblue',
    };
    tableHeaders.push(
      <StyledTableCell
        variant="head"
        key={`phase${deliverableIndex}`}
      >
        <Fragment>
          <ProjectWorkPackageQuestionMenu
            projectList={projectList}
            currentProject={currentProject}
            typeOfMenu={'deliverable'}
            menuIndex={`${deliverableIndex}`}
            handleMenu={handleMenu}
          />

          <Input
            multiline
            disableUnderline
            value={`${project.deliverables[deliverableIndex].name} (${percentageComplete})`}
            id={`deliverable.${deliverableIndex}`}
            style={stepHeadLabelStyle}
          />
        </Fragment>
      </StyledTableCell>,
    );
  });

  return (
    <Paper className={classes.paper}>
      <Table
        className={classes.table}
        size="small"
        style={{ minWidth: 750 }}
      >
        <TableHead>
          <TableRow>{tableHeaders}</TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </Paper>
  );
}
