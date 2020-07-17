from .models import Profile
from django import forms


class ProfileCreate(forms.ModelForm):

    class Meta:
        model = Profile
        fields = ['bio', 'prof_img']