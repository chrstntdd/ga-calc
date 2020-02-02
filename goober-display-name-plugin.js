// @ts-check
function gooberDisplayNamePlugin({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        if (path.node.declarations) {
          let [variableDeclarator] = path.node.declarations
          let variableId

          /**
           * Handle standard goober usage
           *
           * ```
           * let StyledGoobComp = styled("div")`
           *  color: seagreen;
           *  width: 320px;
           * `
           * ```
           */
          if (variableDeclarator.id && variableDeclarator.id.name) {
            let calleeName
            variableId = variableDeclarator.id.name

            if (
              variableDeclarator.init &&
              variableDeclarator.init.tag &&
              variableDeclarator.init.tag.callee &&
              variableDeclarator.init.tag.callee.name
            ) {
              calleeName = variableDeclarator.init.tag.callee.name
              if (calleeName === "styled") {
                addDisplayName({ path, t, variableId })
              }
            }

            /**
             * Handle TS quirks
             *
             * ```
             * let StyledGoob = styled("section")`
             *  color: blue;
             *  height: 42px;
             * ` as React.FC
             * ```
             */

            if (
              t.isTSAsExpression(variableDeclarator.init) &&
              t.isTaggedTemplateExpression(
                variableDeclarator.init.expression
              ) &&
              variableDeclarator.init.expression.tag.callee.name
            ) {
              calleeName = variableDeclarator.init.expression.tag.callee.name
              if (calleeName === "styled") {
                addDisplayName({ path, t, variableId })
              }
            }
          }
        }
      }
    }
  }
}

function addDisplayName({ path, t, variableId }) {
  path.insertAfter(
    t.expressionStatement(
      t.assignmentExpression(
        "=",
        t.memberExpression(
          t.identifier(variableId),
          t.identifier("displayName")
        ),
        // Set new display name
        t.stringLiteral(`${variableId}-styled`)
      )
    )
  )
}

module.exports = gooberDisplayNamePlugin
