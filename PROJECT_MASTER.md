# Project Master Prompt

## Project Overview
- **Name:** [Enter project name]
- **Purpose:** [Describe the high-level goal and what problem this solves]
- **Success Criteria:** [Define measurable outcomes that indicate project success]
- **Target Users:** [Who will use this software?]
- **Project Timeline:** [Expected duration/milestones]

## Requirements

### Functional Requirements
- **FR-001:** [Describe what the system must do - be specific and testable]
- **FR-002:** [Additional functional requirement]
- **FR-003:** [Additional functional requirement]
- **FR-004:** [Add or remove as needed]

### Non-Functional Requirements  
- **NFR-001:** Performance - [e.g., "Process 1000 records per second"]
- **NFR-002:** Security - [e.g., "Encrypt all data at rest and in transit"]
- **NFR-003:** Scalability - [e.g., "Support up to 10,000 concurrent users"]
- **NFR-004:** Reliability - [e.g., "99.9% uptime"]
- **NFR-005:** Usability - [e.g., "Intuitive interface requiring < 1 hour training"]
- **NFR-006:** Maintainability - [e.g., "Code must be well-documented and modular"]

### Data Requirements
- **Data Sources:** [What data will the system work with?]
- **Data Volume:** [Expected data size/growth]
- **Data Format:** [Input/output formats required]
- **Data Security:** [Sensitive data handling requirements]

## Constraints

### Technology Constraints
- **Preferred Languages:** [e.g., Python, MATLAB, C++]
- **Existing Systems:** [Systems that must be integrated with]
- **Hardware Limitations:** [Computational or memory constraints]
- **Platform Requirements:** [Windows, Linux, macOS, web-based, etc.]

### Resource Constraints
- **Timeline:** [Development timeframe]
- **Budget:** [Financial constraints if any]
- **Team Size:** [Number of developers]
- **Skill Level:** [Current team capabilities]

### External Constraints
- **Regulatory:** [Compliance requirements]
- **Organizational:** [Company/university policies]
- **Integration:** [Must work with existing tools/workflows]

## Deliverables

### Primary Deliverables
- [ ] Working application/software
- [ ] Source code (well-documented)
- [ ] User documentation
- [ ] Installation/deployment guide
- [ ] Test suite with >80% coverage

### Optional Deliverables
- [ ] API documentation
- [ ] Performance benchmarks
- [ ] Training materials
- [ ] Migration tools
- [ ] Monitoring/logging setup

## Quality Standards
- **Code Quality:** [e.g., "Follow PEP8 for Python, include docstrings"]
- **Testing:** [e.g., "Unit tests for all functions, integration tests for workflows"]
- **Documentation:** [e.g., "README, API docs, inline comments"]
- **Version Control:** [e.g., "Git with semantic versioning"]

## Specification Generation Parameters

### Number of Specifications
- **Specifications to Generate:** [Choose 1-5, typically 2-3 for most projects]
- **Rationale:** [Why this number? e.g., "3 specs to explore different complexity levels"]

### Evaluation Criteria (with weights)
- **Performance:** [Weight %] - How fast/efficient the solution is
- **Maintainability:** [Weight %] - How easy to modify and extend
- **Development Speed:** [Weight %] - How quickly can be implemented
- **Learning Curve:** [Weight %] - How much new technology must be learned
- **Scalability:** [Weight %] - How well it grows with usage
- **Integration:** [Weight %] - How well it fits with existing systems
- **Cost:** [Weight %] - Financial cost of implementation and maintenance

*Note: Weights should total 100%*

### Risk Tolerance
- **Innovation Level:** [Conservative/Balanced/Innovative]
  - Conservative: Proven technologies, lower risk
  - Balanced: Mix of proven and newer technologies
  - Innovative: Cutting-edge approaches, higher risk/reward
- **Complexity Tolerance:** [Simple/Moderate/Complex]
- **Learning Curve Acceptance:** [Low/Medium/High]

## Context and Background

### Problem Statement
[Detailed description of the problem being solved]

### Current State
[How is this problem currently handled? What are the pain points?]

### Expected Impact
[How will this solution improve the current situation?]

### Success Metrics
[How will you measure success after deployment?]

## File Structure Reference
```
project-root/
├── PROJECT_MASTER.md          # This file
├── specs/                     # Generated specifications
│   ├── spec-01-[approach]/   
│   ├── spec-02-[approach]/   
│   └── spec-03-[approach]/   
├── evaluation/                # Analysis and decision docs
│   ├── feasibility-analysis.md
│   ├── comparison-matrix.md
│   └── decision-log.md
├── selected-implementation/   # Chosen approach implementation
├── docs/                     # Project documentation
├── tests/                    # Test files
└── README.md                 # Project overview
```

## Notes and Additional Context
[Any additional information that would help with specification generation]

---

**Instructions for Use:**
1. Fill out all sections above with your specific project details
2. Be as specific as possible - vague requirements lead to poor specifications
3. Include any domain-specific knowledge or constraints
4. Consider both immediate needs and future growth
5. Save this file as `PROJECT_MASTER.md` in your project root directory

**Next Steps:**
After completing this template:
1. Generate specifications using this master prompt
2. Create detailed task breakdowns for each specification
3. Evaluate specifications against your criteria
4. Select the best approach for implementation
