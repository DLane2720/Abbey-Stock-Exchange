# Agent Instructions for Implementation

## Project Context

### Project Overview
- **Project Name:** [Reference PROJECT_MASTER.md]
- **Selected Approach:** [Reference to chosen specification]
- **Current Phase:** [Development phase being worked on]
- **Overall Progress:** [X% complete, Phase Y of Z]

### Key Reference Files
You should always reference these files for context:
- **Requirements:** `../PROJECT_MASTER.md` - Original project requirements and constraints
- **Specification:** `../specs/spec-0X-[approach]/SPEC.md` - Selected technical approach
- **Task List:** `../specs/spec-0X-[approach]/TASKS.md` - Detailed task breakdown
- **Current Progress:** This file (updated after each task)

## Development Standards

### Coding Standards
- **Primary Language:** [e.g., Python 3.9+]
- **Style Guide:** [e.g., PEP 8 for Python, Google Style Guide for C++]
- **Code Organization:**
  - Use meaningful variable and function names
  - Include docstrings for all functions and classes
  - Keep functions focused and single-purpose
  - Use consistent indentation and formatting
- **Error Handling:** 
  - Include appropriate try/catch blocks
  - Provide meaningful error messages
  - Log errors appropriately
- **Performance:** 
  - Write efficient algorithms
  - Consider memory usage for large datasets
  - Profile performance-critical sections

### Documentation Requirements
- **Inline Comments:** Explain complex logic and business rules
- **Docstrings:** Document all functions, classes, and modules
- **README Updates:** Keep installation and usage instructions current
- **API Documentation:** Document all public interfaces
- **Change Log:** Record significant changes and decisions

### Testing Requirements
- **Unit Tests:** Cover all functions with >80% code coverage
- **Integration Tests:** Test component interactions
- **Test Data:** Use realistic but safe test data
- **Test Documentation:** Explain test scenarios and expected outcomes
- **Continuous Testing:** Run tests before each commit

### Version Control Practices
- **Commit Messages:** Use clear, descriptive commit messages
- **Commit Frequency:** Small, focused commits
- **Branch Strategy:** [Describe branching approach if applicable]
- **Code Review:** [Process for code review if applicable]

## Current Implementation Status

### Completed Tasks
- [x] [Task ID]: [Brief description] - [Date completed]
- [x] [Task ID]: [Brief description] - [Date completed]

### Current Task
- **Task ID:** [Current task being worked on]
- **Task Description:** [Detailed description from TASKS.md]
- **Expected Deliverables:** [What should be created/modified]
- **Acceptance Criteria:** [How to validate completion]
- **Dependencies:** [Prerequisites that must be complete]
- **Estimated Time:** [Time estimate for this task]

### Next Tasks (Upcoming)
- [ ] [Task ID]: [Brief description]
- [ ] [Task ID]: [Brief description]
- [ ] [Task ID]: [Brief description]

## Technical Context

### Architecture Overview
[Brief summary of the chosen architecture from the specification]

### Technology Stack
- **Language:** [Primary programming language]
- **Framework:** [If applicable]
- **Database:** [If applicable]
- **Key Libraries:** [List important dependencies]
- **Development Tools:** [IDE, testing frameworks, etc.]

### Directory Structure
```
project-root/
├── src/                    # Source code
├── tests/                  # Test files
├── docs/                   # Documentation
├── config/                 # Configuration files
├── data/                   # Data files (if applicable)
└── scripts/                # Utility scripts
```

### Key Components
1. **[Component 1]:** [Purpose and current status]
2. **[Component 2]:** [Purpose and current status]
3. **[Component 3]:** [Purpose and current status]

## Implementation Guidelines

### Task Execution Process
When working on a task:
1. **Review Context:** Always start by reviewing the current task details
2. **Understand Requirements:** Reference the original requirements and specification
3. **Plan Implementation:** Break down the task into smaller steps
4. **Write Code:** Follow coding standards and best practices
5. **Test Implementation:** Verify the code works as expected
6. **Document Changes:** Update relevant documentation
7. **Validate Completion:** Check against acceptance criteria

### Code Quality Checklist
Before completing any task, ensure:
- [ ] Code follows established style guidelines
- [ ] All functions have appropriate documentation
- [ ] Error handling is implemented where needed
- [ ] Unit tests are written and passing
- [ ] Integration with existing code works
- [ ] Performance is acceptable
- [ ] Security considerations are addressed

### Common Patterns and Utilities
[Document common code patterns, utility functions, or design patterns being used in this project]

### Integration Points
[Describe how components should integrate with each other and with external systems]

## Research-Specific Considerations
*[Customize this section based on the project type]*

### Data Handling
- **Data Sources:** [Description of data sources and formats]
- **Data Validation:** [Requirements for data quality and validation]
- **Data Processing:** [Standards for data processing and analysis]
- **Data Storage:** [How data should be stored and managed]

### Scientific Computing Standards
- **Reproducibility:** Ensure all analyses can be reproduced
- **Documentation:** Document algorithms and methodologies clearly
- **Validation:** Include validation against known benchmarks
- **Performance:** Consider computational efficiency for large datasets

## Troubleshooting and Support

### Common Issues
[Document common problems encountered and their solutions]

### Debugging Guidelines
- Use appropriate logging levels
- Include debugging information in error messages
- Test edge cases and error conditions
- Validate inputs and outputs

### Getting Help
When stuck:
1. Review the specification and requirements
2. Check similar implementations in the codebase
3. Consult relevant documentation or API references
4. Ask specific questions about the current task

## Session Management

### Context Refresh
If starting a new Claude Code session, always:
1. Review the current task from TASKS.md
2. Check the project status in this file
3. Understand what was accomplished in previous sessions
4. Load relevant code files for context

### Progress Updates
After completing each task:
1. Update the "Completed Tasks" section
2. Move to the next task in "Current Task"
3. Update any architectural or technical context that changed
4. Commit changes with clear messages

### Handoff Information
For the next session or developer:
- **Current Status:** [Where we left off]
- **Next Steps:** [What should be done next]
- **Known Issues:** [Any problems or concerns to address]
- **Decisions Made:** [Important technical decisions and rationale]

## Quality Assurance

### Testing Strategy
- Run unit tests after each significant change
- Perform integration testing every few tasks
- Validate against original requirements regularly
- Test edge cases and error conditions

### Performance Monitoring
- Profile performance-critical sections
- Monitor memory usage for large datasets
- Validate response times meet requirements
- Document performance characteristics

### Security Considerations
[Include any security requirements specific to this project]

## Notes and Decisions

### Technical Decisions Log
- **[Date]:** [Decision made] - [Rationale]
- **[Date]:** [Decision made] - [Rationale]

### Lessons Learned
[Document insights gained during implementation]

### Future Improvements
[Ideas for enhancement or refactoring]

---

**Last Updated:** [Date and time]
**Updated By:** [Session identifier or developer name]
**Current Task:** [Task ID being worked on]
**Overall Progress:** [Percentage complete]

**Instructions for Use:**
1. Always review this file at the start of each Claude Code session
2. Update progress after completing each task
3. Reference the key files listed for context
4. Follow the coding standards and testing requirements
5. Document decisions and changes made
