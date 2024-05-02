export const getDashboardDataQuery = (values) => (`
query MyQuery {
  getAnswersMetrics(fromDate: "${values.fromDate}", toDate: "${values.toDate}") {
    answerModeMetrics {
      anonymous
      answered
      skipped
    }
    fromDate
    toDate
    totalAnswers
    totalAnswers
    totalSkips
    totalAnonymous
    q3Metrics {
      choiceName
      choiceVote
    }
    q6Metrics {
      choiceName
      choiceVote
    }
    studentAnswersMetrics {
      answerCount
      studentId
      studentName
      detailedJSON {
        questionLabel
        answersLabel
        selectedAnswer
        answeredAt
      }
    }
    questionBasedAnswerMetrics {
      question
      questionOrder
      options {
        choiceName
        choiceVote
      }
    }
  }
}
`)