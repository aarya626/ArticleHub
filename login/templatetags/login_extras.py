from django import template
from django.utils.timesince import timesince
from django.utils import timezone

register = template.Library()

@register.filter
def simplify_timesince(value):
    now = timezone.now()
    difference = now - value
    
    # Extract years, months, days, hours, minutes, and seconds from the difference
    years = difference.days // 365
    months = difference.days % 365 // 30
    days = difference.days % 30
    hours = difference.seconds // 3600
    minutes = (difference.seconds % 3600) // 60
    seconds = difference.seconds % 60
    
    # Generate the simplified output
    if years > 0:
        return f"{years} {'year' if years == 1 else 'years'} ago"
    elif months > 0:
        return f"{months} {'month' if months == 1 else 'months'} ago"
    elif days > 0:
        return f"{days} {'day' if days == 1 else 'days'} ago"
    elif hours > 0:
        return f"{hours} {'hour' if hours == 1 else 'hours'} ago"
    elif minutes > 0:
        return f"{minutes} {'minute' if minutes == 1 else 'minutes'} ago"
    else:
        return f"{seconds} {'second' if seconds == 1 else 'seconds'} ago"
