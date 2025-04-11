# Naturalist Competition Web App - Project Description

## Project Overview

This web application serves as the front-end interface for a naturalist competition platform that processes iNaturalist data. The application has two primary functions:
1. An expert evaluation interface for scoring observations
2. An animated results presentation display for competition totals

The application will be developed using Vite with JavaScript/TypeScript and Bootstrap for UI components, focusing solely on front-end functionality while communicating with separately developed back-end services.

## Objectives

- Create an intuitive interface for expert evaluators to score and comment on iNaturalist observations
- Develop an engaging animated presentation view to display team scores by category
- Ensure responsive design suitable for both evaluation workflow and public presentation
- Implement robust data exchange with the back-end REST APIs
- Deliver a maintainable and extensible codebase using TypeScript

## Technical Requirements

### Development Stack
- **Build Tool**: Vite
- **Languages**: JavaScript, TypeScript, HTML, CSS, SCSS
- **UI Framework**: Bootstrap
- **API Communication**: REST
- **Version Control**: Git (recommended)

### Architecture Components
- **Evaluation Module**: Interface for experts to review and score observations
- **Presentation Module**: Animated scoreboard functionality
- **API Service Layer**: Handles communication with back-end services
- **State Management**: For managing application state and data flow
- **Authentication**: Interface with back-end authentication (if required)

## Key Features

### Evaluation Interface
- User authentication for expert evaluators
- Display of preprocessed iNaturalist observations for review
- Scoring mechanism allowing experts to assign:
  - 0 points (incorrect/invalid)
  - 0.5 points (partially correct)
  - 1 point (fully correct)
- Comment submission for each observation
- Progress tracking for evaluators
- Session management to prevent data loss

### Results Presentation Display
- Animated scoreboard showing team totals
- Column-by-column reveal animation triggered manually
- Rows organized by team names
- Columns representing observation categories (plants, birds, bugs, etc.)
- Visual indication of ranking/placement
- Clean, readable design optimized for public display

### General Features
- Responsive design for various screen sizes
- Error handling and status notifications
- Data caching for improved performance
- Loading states for asynchronous operations

## Implementation Timeline

### Phase 1: Setup and Foundation (1-2 weeks)
- Project initialization with Vite and TypeScript
- Bootstrap integration and basic styling setup
- API service layer implementation
- Basic routing and application structure

### Phase 2: Evaluation Interface (2-3 weeks)
- Expert authentication flow
- Observation display components
- Scoring and comment functionality
- Form validation and submission
- Expert dashboard with progress tracking

### Phase 3: Results Presentation (2-3 weeks)
- Data transformation for scoreboard display
- Table component development
- Animation implementation for column-by-column reveal
- Manual controls for presentation flow
- Styling and visual enhancements

### Phase 4: Integration and Testing (1-2 weeks)
- Full integration with back-end APIs
- Comprehensive testing across features
- Performance optimization
- Bug fixes and refinements

### Phase 5: Documentation and Deployment (1 week)
- Code documentation completion
- User guides for both interfaces
- Deployment preparation
- Handover to stakeholders

## API Integration Points

The application will integrate with the following back-end API endpoints (to be provided by BE team):
- Authentication endpoints (if required)
- Observation data retrieval
- Evaluation submission
- Results data retrieval for presentation

## Future Considerations

- Potential for offline functionality with sync capabilities
- Enhanced data visualization for results
- Advanced filtering and sorting options for evaluators
- Integration with notification systems
- Performance enhancements for larger datasets

---

*Note: This project description serves as a living document. Updates and refinements may be made as the project progresses and requirements are further clarified.*