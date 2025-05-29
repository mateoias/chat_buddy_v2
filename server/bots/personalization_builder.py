def build_personalization_context(user_background):
    """
    Build a natural language context from user background and personalization data.
    Returns a string to be added to the system prompt.
    """
    print(f"=== PERSONALIZATION BUILDER ===")
    print(f"Received user_background: {user_background}")
    
    if not user_background:
        print("No user_background provided")
        return ""
    
    context_parts = []
    
    # Add basic language information
    context_parts.append("User Context:")
    context_parts.append(f"- Native Language: {user_background.get('native_lang', 'unknown')}")
    context_parts.append(f"- Target Language: {user_background.get('target_lang', 'unknown')}")
    context_parts.append(f"- Skill Level: {user_background.get('skill_level', 'beginner')}")
    
    # Add personalization if available
    if 'personalization' in user_background and user_background['personalization']:
        print(f"Found personalization: {user_background['personalization']}")
        personalization = user_background['personalization']
        
        # Filter out empty or "no" responses
        meaningful_data = {}
        for k, v in personalization.items():
            # Skip the 'completed' field and any empty values
            if k == 'completed':
                continue
            # Check if it's a string before calling .lower()
            if isinstance(v, str) and v and v.lower() != 'no':
                meaningful_data[k] = v
            elif not isinstance(v, str) and v:  # Non-string values that are truthy
                meaningful_data[k] = v
        
        if meaningful_data:
            context_parts.append("")  # Empty line for readability
            context_parts.append("The user has provided the following personal information:")
            context_parts.append(f"{meaningful_data}")
            context_parts.append("")
            context_parts.append("Use this information naturally in conversation when relevant, but don't force it.")
    else:
        print("No personalization in user_background")
    
    result = "\n".join(context_parts)
    print(f"Built context: {result}")
    return result